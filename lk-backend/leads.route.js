// POST /api/leads — приём заявок с публичной формы champion-footboll.ru/#/signup.
// Создаёт ученика (он же лид) в MoyKlass через существующий services/moyklass.js.
//
// Схема запроса от формы:
//   { parentName, childName, phone, dob, kindergarten, group, privilege?, source? }
//
// Маппинг в MoyKlass POST /v1/company/users (схема проверена живым API):
//   name           ← childName
//   phone          ← цифры phone, без "+" (^[0-9]{10,15}$)
//   attributes[]   ← массив { attributeId, value | valueIds }:
//     id=1     birthday        date,         value: "YYYY-MM-DD"
//     id=9160  nomer_sada      number,       value: <number>
//     id=9158  gruppa_v_sadu   string,       value: "<строка>"
//     id=4     client_type     multiselect,  valueIds: [<id>]

const express = require('express');
const moyKlass = require('../services/moyklass');

const router = express.Router();

// ID признаков ученика в CRM (alias → id), проверено через GET /userAttributes.
const ATTR_IDS = {
    birthday: 1,
    nomer_sada: 9160,
    gruppa_v_sadu: 9158,
    client_type: 4,
};

// Названия вариантов client_type → их id в CRM (проверено по API).
const CLIENT_TYPE_VARIANT_IDS = {
    'Многодетный': 26942,
    'СВО': 26943,
    'Сотрудник': 40101,
    '2 детей': 40102,
    'Опекун': 40103,
};

router.post('/', async (req, res) => {
    try {
        const body = req.body || {};

        const parentName = String(body.parentName || '').trim();
        const childName = String(body.childName || '').trim();
        const phone = String(body.phone || '').trim();
        const dob = String(body.dob || '').trim();
        const kindergartenRaw = body.kindergarten ? String(body.kindergarten).trim() : '';
        const group = body.group ? String(body.group).trim() : '';
        const privilege = body.privilege ? String(body.privilege).trim() : '';
        const source = body.source ? String(body.source).trim() : 'champion-footboll.ru';

        if (childName.length < 2) {
            return res.status(400).json({ error: 'childName is required' });
        }
        if (!/^\+7\d{10}$/.test(phone)) {
            return res.status(400).json({ error: 'phone must match +7XXXXXXXXXX' });
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
            return res.status(400).json({ error: 'dob must be ISO YYYY-MM-DD' });
        }

        const attributes = [
            { attributeId: ATTR_IDS.birthday, value: dob },
        ];

        if (kindergartenRaw) {
            const n = Number(kindergartenRaw.replace(/\D/g, ''));
            if (Number.isFinite(n) && n > 0) {
                attributes.push({ attributeId: ATTR_IDS.nomer_sada, value: n });
            }
        }
        if (group) {
            attributes.push({ attributeId: ATTR_IDS.gruppa_v_sadu, value: group });
        }
        if (privilege) {
            const variantId = CLIENT_TYPE_VARIANT_IDS[privilege];
            if (variantId) {
                // multiselect ждёт valueIds, не value
                attributes.push({ attributeId: ATTR_IDS.client_type, valueIds: [variantId] });
            } else {
                console.warn('[leads] неизвестный вариант льготы:', privilege);
            }
        }

        // MoyKlass принимает phone без "+", только цифры (^[0-9]{10,15}$)
        const phoneDigits = phone.replace(/\D/g, '');

        // ФИО родителя требует п. 4.1 Оферты. Отдельного признака под него в
        // MoyKlass нет, поэтому кладём в комментарий к карточке ученика.
        const commentLines = [`Источник: ${source}`];
        if (parentName) commentLines.push(`Родитель: ${parentName}`);

        const payload = {
            name: childName,
            phone: phoneDigits,
            attributes,
            comment: commentLines.join('\n'),
        };

        const created = await moyKlass.createUser(payload);
        return res.json({ ok: true, userId: created?.id ?? null });
    } catch (err) {
        const status = err?.response?.status;
        const responseBody = err?.response?.data;
        console.error('[leads] ошибка создания заявки', { status, responseBody, message: err?.message });
        return res.status(502).json({
            error: 'MoyKlass rejected the request',
            status: status ?? null,
            body: responseBody ?? err?.message ?? 'unknown',
        });
    }
});

// GET /api/leads/probe — диагностика, возвращает фактический список
// признаков ученика, чтобы можно было сверить алиасы и id вариантов
// client_type. Должен срабатывать через MoyKlassService, чтобы
// использовать тот же accessToken.
router.get('/probe', async (_req, res) => {
    try {
        if (!moyKlass.accessToken) await moyKlass.getToken();
        const axios = require('axios');
        const resp = await axios.get(`${moyKlass.baseUrl}/userAttributes`, {
            headers: { 'x-access-token': moyKlass.accessToken },
        });
        const list = Array.isArray(resp.data) ? resp.data : [];
        const usedAliases = ['birthday', 'nomer_sada', 'gruppa_v_sadu', 'client_type'];
        const summary = list
            .filter((f) => usedAliases.includes(f.alias))
            .map((f) => ({
                id: f.id,
                alias: f.alias,
                name: f.name,
                type: f.type,
                ...(f.variants ? { variants: f.variants.map((v) => ({ id: v.id, name: v.name })) } : {}),
            }));
        return res.json({
            usedAliases,
            knownPrivilegeVariants: CLIENT_TYPE_VARIANT_IDS,
            attributes: summary,
        });
    } catch (err) {
        return res.status(502).json({ error: err?.message || 'unknown error' });
    }
});

module.exports = router;
