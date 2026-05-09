/**
 * Express route to drop into the LK backend (lk.champion-footboll.ru).
 *
 * Accepts JSON from the public signup form on champion-footboll.ru/#/signup
 * and creates a record in MoyKlass.
 *
 * IMPORTANT — about MoyKlass terminology
 * ──────────────────────────────────────
 * In MoyKlass API there is no "lead" entity. Both leads and clients are
 * the same object called "user" / "ученик", differing only by status
 * (clientStateId). New signups go in via:
 *
 *   POST /v1/company/users
 *
 * Custom fields are called "признаки ученика" (UserAttribute) and live
 * at GET /v1/company/userAttributes. Every attribute has a numeric `id`
 * and a string `alias`, and you can set values either way:
 *
 *   { "attributes": { "birthday": "2020-05-15" } }      // by alias
 *   { "attributes": { "1":        "2020-05-15" } }     // by id
 *
 * (The same shape that the filter on GET /users uses:
 *  ?attributes[birthday]=...)
 *
 * The aliases for this CRM, per the operator: birthday, nomer_sada,
 * gruppa_v_sadu, lgota. Override via env if they differ.
 *
 * Mount example:
 *   const leads = require('./routes/leads.route');
 *   app.post('/api/leads',       express.json(), leads.create);
 *   app.get ('/api/leads/probe',                 leads.probe);
 *
 * Required env:
 *   MOYKLASS_API_KEY  – API key from MoyKlass → Настройки → API.
 *
 * Optional env:
 *   MOYKLASS_FILIAL_ID         – default filial id for new users.
 *   MOYKLASS_CLIENT_STATE_ID   – default status id (e.g. "новая заявка").
 *   MOYKLASS_ATTR_BIRTHDAY     – default 'birthday'
 *   MOYKLASS_ATTR_KINDERGARTEN – default 'nomer_sada'
 *   MOYKLASS_ATTR_GROUP        – default 'gruppa_v_sadu'
 *   MOYKLASS_ATTR_PRIVILEGE    – default 'lgota'
 */

const MOYKLASS_BASE = 'https://api.moyklass.com';

const ATTR = {
    birthday: process.env.MOYKLASS_ATTR_BIRTHDAY || 'birthday',
    kindergarten: process.env.MOYKLASS_ATTR_KINDERGARTEN || 'nomer_sada',
    group: process.env.MOYKLASS_ATTR_GROUP || 'gruppa_v_sadu',
    privilege: process.env.MOYKLASS_ATTR_PRIVILEGE || 'lgota',
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
    const resp = await fetch(`${MOYKLASS_BASE}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,
            ...(init.headers || {}),
        },
    });
    return resp;
}

async function create(req, res) {
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

        const attributes = {
            [ATTR.birthday]: dob,
        };
        if (kindergarten) attributes[ATTR.kindergarten] = kindergarten;
        if (group) attributes[ATTR.group] = group;
        if (privilege) attributes[ATTR.privilege] = privilege;

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
            console.error('[leads] MoyKlass POST /users failed', {
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
 * GET /api/leads/probe
 *
 * One-shot diagnostic. Returns the list of признаки ученика so the
 * operator can confirm the alias names ("birthday", "nomer_sada", etc.)
 * actually exist on this CRM. Hit it once after wiring things up; you
 * can keep it or remove it later.
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
        const summary = Array.isArray(list)
            ? list.map((f) => ({ id: f.id, alias: f.alias, name: f.name, type: f.type }))
            : list;
        return res.json({
            expectedAliases: ATTR,
            attributes: summary,
        });
    } catch (err) {
        return res.status(502).json({ error: err?.message || 'Unknown error' });
    }
}

module.exports = { create, probe };
// Backwards-compat: a default Express handler that does the create.
module.exports.default = create;
// Allow `app.post('/api/leads', leadsRoute)` style:
Object.assign(module.exports, { create, probe });
module.exports = Object.assign(create, { create, probe });
