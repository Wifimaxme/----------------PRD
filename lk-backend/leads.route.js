/**
 * Express route to drop into the LK backend (lk.champion-footboll.ru).
 *
 * Mount at POST /api/leads. Receives JSON from the public signup form on
 * champion-footboll.ru/#/signup and creates a lead in MoyKlass.
 *
 * Custom field IDs are auto-discovered by name on the first request and
 * cached for an hour, so the only required env is MOYKLASS_API_KEY. Make
 * sure the field names in MoyKlass admin match the constants below
 * (override via env if you renamed them).
 *
 * Mount example:
 *   const leadsRoute = require('./routes/leads.route');
 *   app.post('/api/leads', express.json(), leadsRoute);
 *
 * Required env:
 *   MOYKLASS_API_KEY  – API key from MoyKlass → Сотрудники → API.
 *
 * Optional env:
 *   MOYKLASS_FILIAL_ID, MOYKLASS_STATUS_ID — числовые id филиала/статуса.
 *   MOYKLASS_CF_KINDERGARTEN_NAME — override field name (default "Детский сад").
 *   MOYKLASS_CF_GROUP_NAME        — override field name (default "Группа").
 *   MOYKLASS_CF_PRIVILEGE_NAME    — override field name (default "Льгота").
 */

const MOYKLASS_BASE = 'https://api.moyklass.com';

const FIELD_NAMES = {
    kindergarten: process.env.MOYKLASS_CF_KINDERGARTEN_NAME || 'Детский сад',
    group: process.env.MOYKLASS_CF_GROUP_NAME || 'Группа',
    privilege: process.env.MOYKLASS_CF_PRIVILEGE_NAME || 'Льгота',
};

let cachedToken = null;
let cachedTokenExpiresAt = 0;

let cachedFieldIds = null;
let cachedFieldIdsExpiresAt = 0;

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

async function discoverCustomFieldIds(accessToken) {
    const now = Date.now();
    if (cachedFieldIds && now < cachedFieldIdsExpiresAt) {
        return cachedFieldIds;
    }

    const ids = { kindergarten: null, group: null, privilege: null };

    // MoyKlass returns lead-side custom fields here. Some installations
    // expose this at /v1/company/leadCustomFields — try both.
    const candidates = [
        `${MOYKLASS_BASE}/v1/company/customFields`,
        `${MOYKLASS_BASE}/v1/company/leadCustomFields`,
    ];

    for (const url of candidates) {
        try {
            const resp = await fetch(url, {
                headers: { 'x-access-token': accessToken },
            });
            if (!resp.ok) continue;
            const data = await resp.json();
            const list = Array.isArray(data) ? data : data?.customFields ?? data?.fields ?? [];
            if (!Array.isArray(list) || list.length === 0) continue;

            for (const field of list) {
                const name = String(field?.name || '').trim();
                const id = field?.id;
                if (!name || id == null) continue;
                if (name.localeCompare(FIELD_NAMES.kindergarten, 'ru', { sensitivity: 'base' }) === 0) {
                    ids.kindergarten = Number(id);
                } else if (name.localeCompare(FIELD_NAMES.group, 'ru', { sensitivity: 'base' }) === 0) {
                    ids.group = Number(id);
                } else if (name.localeCompare(FIELD_NAMES.privilege, 'ru', { sensitivity: 'base' }) === 0) {
                    ids.privilege = Number(id);
                }
            }
            if (ids.kindergarten || ids.group || ids.privilege) break;
        } catch {
            // try next candidate
        }
    }

    cachedFieldIds = ids;
    cachedFieldIdsExpiresAt = now + 60 * 60 * 1000;
    return ids;
}

module.exports = async function leadsRoute(req, res) {
    try {
        const body = req.body || {};

        const childName = String(body.childName || '').trim();
        const phone = String(body.phone || '').trim();
        const dob = String(body.dob || '').trim();
        const kindergarten = body.kindergarten ? String(body.kindergarten).trim() : '';
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
        const fieldIds = await discoverCustomFieldIds(accessToken);

        const customFieldsValues = [];
        const missingFields = [];
        if (kindergarten) {
            if (fieldIds.kindergarten) {
                customFieldsValues.push({ customFieldId: fieldIds.kindergarten, value: kindergarten });
            } else {
                missingFields.push(FIELD_NAMES.kindergarten);
            }
        }
        if (group) {
            if (fieldIds.group) {
                customFieldsValues.push({ customFieldId: fieldIds.group, value: group });
            } else {
                missingFields.push(FIELD_NAMES.group);
            }
        }
        if (privilege) {
            if (fieldIds.privilege) {
                customFieldsValues.push({ customFieldId: fieldIds.privilege, value: privilege });
            } else {
                missingFields.push(FIELD_NAMES.privilege);
            }
        }

        const descriptionLines = [`Источник: ${source}`];
        if (missingFields.length) {
            descriptionLines.push(
                `⚠ Поля не нашлись в CRM (создайте их с такими именами): ${missingFields.join(', ')}.`,
            );
            // Inline the values so they're not lost.
            if (kindergarten && missingFields.includes(FIELD_NAMES.kindergarten)) {
                descriptionLines.push(`Сад: ${kindergarten}`);
            }
            if (group && missingFields.includes(FIELD_NAMES.group)) {
                descriptionLines.push(`Группа: ${group}`);
            }
            if (privilege && missingFields.includes(FIELD_NAMES.privilege)) {
                descriptionLines.push(`Льгота: ${privilege}`);
            }
        }

        const leadPayload = {
            name: childName,
            phone,
            dob,
            ...(process.env.MOYKLASS_FILIAL_ID
                ? { filialId: Number(process.env.MOYKLASS_FILIAL_ID) }
                : {}),
            ...(process.env.MOYKLASS_STATUS_ID
                ? { statusId: Number(process.env.MOYKLASS_STATUS_ID) }
                : {}),
            ...(customFieldsValues.length ? { customFieldsValues } : {}),
            description: descriptionLines.join('\n'),
        };

        const createResp = await fetch(`${MOYKLASS_BASE}/v1/company/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken,
            },
            body: JSON.stringify(leadPayload),
        });

        if (!createResp.ok) {
            const errorBody = await createResp.text().catch(() => '');
            return res.status(502).json({
                error: 'MoyKlass rejected the lead',
                status: createResp.status,
                body: errorBody.slice(0, 500),
            });
        }

        const created = await createResp.json().catch(() => ({}));
        return res.json({
            ok: true,
            leadId: created?.id ?? null,
            ...(missingFields.length ? { warning: `custom fields not found: ${missingFields.join(', ')}` } : {}),
        });
    } catch (err) {
        return res.status(502).json({ error: err?.message || 'Unknown error' });
    }
};
