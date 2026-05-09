/**
 * Express route to drop into the LK backend (lk.champion-footboll.ru).
 *
 * Accepts JSON from the public signup form on champion-footboll.ru/#/signup
 * and creates an "ученик" (он же лид) in MoyKlass.
 *
 * Verified against the actual CRM (May 2026) — see fields summary below.
 *
 * Endpoint: POST /v1/company/users  (no /leads endpoint; lead and client
 *                                    are the same "user", differ only by
 *                                    clientStateId)
 *
 * Top-level user fields used:
 *   name   – string (имя ребёнка)
 *   phone  – string (контактный телефон родителя, формат +7XXXXXXXXXX)
 *
 * Custom attributes used (returned as array on GET, sent as array on POST):
 *   alias=birthday        id=1     type=date         → дата рождения
 *   alias=nomer_sada      id=9160  type=number       → номер сада
 *   alias=gruppa_v_sadu   id=9158  type=string       → группа в саду
 *   alias=client_type     id=4     type=multiselect  → льготы (массив id вариантов)
 *
 * client_type variants (id → name):
 *   26942 Многодетный
 *   26943 СВО
 *   40101 Сотрудник
 *   40102 2 детей
 *   40103 Опекун
 *
 * Mount example:
 *   const leads = require('./routes/leads.route');
 *   app.post('/api/leads',       express.json(), leads);
 *   app.get ('/api/leads/probe',                 leads.probe);
 *
 * Required env: MOYKLASS_API_KEY.
 */

const MOYKLASS_BASE = 'https://api.moyklass.com';

const CLIENT_TYPE_VARIANT_IDS = {
    'Многодетный': 26942,
    'СВО': 26943,
    'Сотрудник': 40101,
    '2 детей': 40102,
    'Опекун': 40103,
};

let cachedToken = null;
let cachedTokenExpiresAt = 0;

async function getAccessToken(apiKey) {
    const now = Date.now();
    if (cachedToken && now < cachedTokenExpiresAt - 60_000) {
        return cachedToken;
    }
    const resp = await fetch(`${MOYKLASS_BASE}/v1/company/auth/getToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
    });
    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(`MoyKlass auth failed: ${resp.status} ${text.slice(0, 200)}`);
    }
    const data = await resp.json();
    if (!data?.accessToken) {
        throw new Error('MoyKlass auth response missing accessToken');
    }
    cachedToken = data.accessToken;
    cachedTokenExpiresAt = now + 23 * 60 * 60 * 1000;
    return cachedToken;
}

async function moyklassFetch(path, accessToken, init = {}) {
    return fetch(`${MOYKLASS_BASE}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,
            ...(init.headers || {}),
        },
    });
}

async function create(req, res) {
    try {
        const body = req.body || {};

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

        const apiKey = process.env.MOYKLASS_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'MOYKLASS_API_KEY is not configured' });
        }

        const accessToken = await getAccessToken(apiKey);

        const attributes = [
            { attributeAlias: 'birthday', value: dob },
        ];

        if (kindergartenRaw) {
            const n = Number(kindergartenRaw.replace(/\D/g, ''));
            if (Number.isFinite(n) && n > 0) {
                attributes.push({ attributeAlias: 'nomer_sada', value: n });
            }
        }
        if (group) {
            attributes.push({ attributeAlias: 'gruppa_v_sadu', value: group });
        }
        if (privilege) {
            const variantId = CLIENT_TYPE_VARIANT_IDS[privilege];
            if (variantId) {
                attributes.push({ attributeAlias: 'client_type', value: [variantId] });
            } else {
                console.warn('[leads] unknown privilege variant:', privilege);
            }
        }

        const payload = {
            name: childName,
            phone,
            attributes,
            ...(process.env.MOYKLASS_FILIAL_ID
                ? { filials: [Number(process.env.MOYKLASS_FILIAL_ID)] }
                : {}),
            ...(process.env.MOYKLASS_CLIENT_STATE_ID
                ? { clientStateId: Number(process.env.MOYKLASS_CLIENT_STATE_ID) }
                : {}),
            comment: `Источник: ${source}`,
        };

        const createResp = await moyklassFetch('/v1/company/users', accessToken, {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (!createResp.ok) {
            const errorBody = await createResp.text().catch(() => '');
            console.error('[leads] MoyKlass POST /v1/company/users failed', {
                status: createResp.status,
                body: errorBody.slice(0, 1000),
                payload,
            });
            return res.status(502).json({
                error: 'MoyKlass rejected the request',
                status: createResp.status,
                body: errorBody.slice(0, 500),
            });
        }

        const created = await createResp.json().catch(() => ({}));
        return res.json({ ok: true, userId: created?.id ?? null });
    } catch (err) {
        console.error('[leads] unexpected error', err);
        return res.status(502).json({ error: err?.message || 'Unknown error' });
    }
}

/**
 * GET /api/leads/probe — диагностика, возвращает сводку по признакам
 * ученика и вариантам client_type, чтобы можно было сверить.
 */
async function probe(_req, res) {
    try {
        const apiKey = process.env.MOYKLASS_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'MOYKLASS_API_KEY is not configured' });
        }
        const accessToken = await getAccessToken(apiKey);
        const resp = await moyklassFetch('/v1/company/userAttributes', accessToken);
        if (!resp.ok) {
            const text = await resp.text().catch(() => '');
            return res.status(502).json({ error: 'GET /userAttributes failed', status: resp.status, body: text.slice(0, 500) });
        }
        const list = await resp.json();
        const usedAliases = ['birthday', 'nomer_sada', 'gruppa_v_sadu', 'client_type'];
        const summary = Array.isArray(list)
            ? list
                .filter((f) => usedAliases.includes(f.alias))
                .map((f) => ({
                    id: f.id,
                    alias: f.alias,
                    name: f.name,
                    type: f.type,
                    ...(f.variants ? { variants: f.variants.map((v) => ({ id: v.id, name: v.name })) } : {}),
                }))
            : list;
        return res.json({
            usedAliases,
            knownPrivilegeVariants: CLIENT_TYPE_VARIANT_IDS,
            attributes: summary,
        });
    } catch (err) {
        return res.status(502).json({ error: err?.message || 'Unknown error' });
    }
}

module.exports = create;
module.exports.create = create;
module.exports.probe = probe;
