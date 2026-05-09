/**
 * Cloudflare Worker: champion-footboll lead intake → MoyKlass CRM.
 *
 * Receives JSON from the public signup form, authenticates against the
 * MoyKlass REST API, and creates a lead.
 *
 * Required environment secrets (set via `wrangler secret put` or the
 * Cloudflare dashboard, NOT in source):
 *   MOYKLASS_API_KEY     – API key from MoyKlass: Сотрудники → API.
 *
 * Optional environment variables:
 *   ALLOWED_ORIGIN       – Origin allowed by CORS. Default:
 *                          https://champion-footboll.ru
 *   MOYKLASS_FILIAL_ID   – Numeric filial id to attach to the lead.
 *   MOYKLASS_STATUS_ID   – Numeric lead status id (e.g. "новая заявка").
 */

const MOYKLASS_BASE = 'https://api.moyklass.com';

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin') || '';
        const allowedOrigin = env.ALLOWED_ORIGIN || 'https://champion-footboll.ru';

        const corsHeaders = {
            'Access-Control-Allow-Origin':
                origin === allowedOrigin ? origin : allowedOrigin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
            Vary: 'Origin',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        if (request.method !== 'POST') {
            return json({ error: 'Method not allowed' }, 405, corsHeaders);
        }

        if (!env.MOYKLASS_API_KEY) {
            return json({ error: 'Worker is not configured (missing API key)' }, 500, corsHeaders);
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return json({ error: 'Invalid JSON' }, 400, corsHeaders);
        }

        const parentName = String(body?.parentName || '').trim();
        const phone = String(body?.phone || '').trim();
        const childName = body?.childName ? String(body.childName).trim() : '';
        const childAge = body?.childAge ? String(body.childAge).trim() : '';
        const kindergarten = body?.kindergarten ? String(body.kindergarten).trim() : '';
        const source = body?.source ? String(body.source).trim() : 'champion-footboll.ru';

        if (!parentName || parentName.length < 2) {
            return json({ error: 'parentName is required' }, 400, corsHeaders);
        }
        if (!/^\+7\d{10}$/.test(phone)) {
            return json({ error: 'phone must match +7XXXXXXXXXX' }, 400, corsHeaders);
        }

        try {
            const accessToken = await getAccessToken(env.MOYKLASS_API_KEY);

            const description = [
                childName && `Имя ребёнка: ${childName}`,
                childAge && `Возраст: ${childAge}`,
                kindergarten && `Сад/адрес: ${kindergarten}`,
                source && `Источник: ${source}`,
            ]
                .filter(Boolean)
                .join('\n');

            const leadPayload = {
                name: parentName,
                phone,
                ...(env.MOYKLASS_FILIAL_ID ? { filialId: Number(env.MOYKLASS_FILIAL_ID) } : {}),
                ...(env.MOYKLASS_STATUS_ID ? { statusId: Number(env.MOYKLASS_STATUS_ID) } : {}),
                ...(description ? { description } : {}),
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
                return json(
                    { error: 'MoyKlass rejected the lead', status: createResp.status, body: errorBody.slice(0, 500) },
                    502,
                    corsHeaders,
                );
            }

            const created = await createResp.json().catch(() => ({}));
            return json({ ok: true, leadId: created?.id ?? null }, 200, corsHeaders);
        } catch (err) {
            return json({ error: err?.message || 'Unknown error' }, 502, corsHeaders);
        }
    },
};

async function getAccessToken(apiKey) {
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
    return data.accessToken;
}

function json(payload, status, headers) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: { ...headers, 'Content-Type': 'application/json' },
    });
}
