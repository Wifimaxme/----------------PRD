# champion-leads — Cloudflare Worker для записи на пробное

Прокси между формой `/signup` и MoyKlass REST API. Скрывает API-ключ от
клиента и валидирует входные данные.

## Как развернуть (один раз)

### Вариант A — через дашборд Cloudflare (без CLI)

1. https://dash.cloudflare.com → Workers & Pages → **Create** → Worker → **Hello World** → Deploy.
2. Открой созданный Worker → **Edit code** → удали содержимое и вставь
   `worker/leads.js`. Save & Deploy.
3. Settings → **Variables and Secrets**:
   - **Secret** `MOYKLASS_API_KEY` → значение из MoyKlass (Сотрудники → API → создать API-ключ).
   - (опционально) **Plain text** `ALLOWED_ORIGIN = https://champion-footboll.ru`.
   - (опционально) `MOYKLASS_FILIAL_ID`, `MOYKLASS_STATUS_ID` — числовые
     id филиала и статуса лида, если хочешь сразу попадать в нужный
     раздел CRM.
4. Скопируй URL Worker'а (вида `https://champion-leads.<account>.workers.dev`).
   Это `LEADS_ENDPOINT`.

### Вариант B — через wrangler CLI

```bash
cd worker
npx wrangler login
npx wrangler secret put MOYKLASS_API_KEY   # вставить ключ из MoyKlass
npx wrangler deploy                         # печатает URL Worker'а
```

## Как подключить фронт

Создай файл `.env.local` в корне репозитория (он в `.gitignore`):

```
VITE_LEADS_ENDPOINT=https://champion-leads.<account>.workers.dev
```

Затем `npm run build && npx gh-pages -d dist`. Форма на `/signup` теперь
будет POST'ить заявки в Worker, а Worker — дальше в MoyKlass.

## Как проверить

Локально в терминале:

```bash
curl -X POST https://champion-leads.<account>.workers.dev \
  -H 'Origin: https://champion-footboll.ru' \
  -H 'Content-Type: application/json' \
  -d '{"parentName":"Тест","phone":"+79991234567","childAge":"5-6 лет","source":"manual-test"}'
```

Ожидается `{"ok":true,"leadId":<число>}`. Лид должен появиться в MoyKlass
в разделе «Лиды».

## Безопасность

- Ключ MoyKlass хранится только как Cloudflare Secret, никогда не
  попадает в git и не отдаётся в браузер.
- CORS разрешён только для `ALLOWED_ORIGIN`.
- Worker валидирует имя и формат телефона до обращения к MoyKlass.
- Нет персистентного хранилища — Worker не логирует ПДн.
