/**
 * Express route to drop into the LK backend (lk.champion-footboll.ru).
 *
 * Mount at POST /api/leads. Receives JSON from the public signup form on
 * champion-footboll.ru/#/signup and creates a lead in MoyKlass.
 *
 * The LK backend already has a working MoyKlass integration
 * ("moyklass":"online" in /api/health), so prefer your existing
 * MoyKlass client / service instead of the inline auth call below.
 *
 * Mount example (in your existing app.js / server.js):
 *
 *   const leadsRoute = require('./routes/leads.route');
 *   app.post('/api/leads', express.json(), leadsRoute);
 *
 * Field mapping (frontend → MoyKlass POST /v1/company/leads):
 *   childName      → name           (standard, required by MoyKlass)
 *   phone          → phone          (standard)
 *   dob            → dob            (standard, ISO YYYY-MM-DD)
 *   kindergarten   → customFieldsValues[MOYKLASS_CF_KINDERGARTEN_ID]
 *   group          → customFieldsValues[MOYKLASS_CF_GROUP_ID]
 *   source         → description    (free-form comment)
 *
 * Required env:
 *   MOYKLASS_API_KEY  – API key from MoyKlass → Сотрудники → API.
 *
 * Optional env (fill in once and the corresponding form fields will land
 * in the right CRM card sections):
 *   MOYKLASS_FILIAL_ID            – default filial id for new leads.
 *   MOYKLASS_STATUS_ID            – default status id (e.g. "новая заявка").
 *   MOYKLASS_CF_KINDERGARTEN_ID   – numeric id of the "детский сад" custom field.
 *   MOYKLASS_CF_GROUP_ID          – numeric id of the "группа" custom field.
 *
 * To find a custom field id: GET /v1/company/customFields with your
 * accessToken and look for the field by name. Or open the field in
 * MoyKlass admin and copy the id from the URL.
 */

const MOYKLASS_BASE = 'https://api.moyklass.com';

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
    cachedTokenExpiresAt = now + 23 * 60 * 60 * 1000; // tokens live ~24h
    return cachedToken;
}

module.exports = async function leadsRoute(req, res) {
    try {
        const body = req.body || {};

        const childName = String(body.childName || '').trim();
        const phone = String(body.phone || '').trim();
        const dob = String(body.dob || '').trim();
        const kindergarten = body.kindergarten ? String(body.kindergarten).trim() : '';
        const group = body.group ? String(body.group).trim() : '';
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

        const customFieldsValues = [];
        if (kindergarten && process.env.MOYKLASS_CF_KINDERGARTEN_ID) {
            customFieldsValues.push({
                customFieldId: Number(process.env.MOYKLASS_CF_KINDERGARTEN_ID),
                value: kindergarten,
            });
        }
        if (group && process.env.MOYKLASS_CF_GROUP_ID) {
            customFieldsValues.push({
                customFieldId: Number(process.env.MOYKLASS_CF_GROUP_ID),
                value: group,
            });
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
            ...(source ? { description: `Источник: ${source}` } : {}),
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
        return res.json({ ok: true, leadId: created?.id ?? null });
    } catch (err) {
        return res.status(502).json({ error: err?.message || 'Unknown error' });
    }
};
