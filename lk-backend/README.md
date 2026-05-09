# lk-backend / leads route

Express handler для приёма заявок с публичной формы записи
(`champion-footboll.ru/#/signup`) и создания лида в MoyKlass.

Файл лежит здесь, чтобы был под рукой и в основном репо. Запускаться он
должен **на бэкенде ЛК** (`lk.champion-footboll.ru`), у которого уже
есть рабочая интеграция с MoyKlass (видно из `/api/health`:
`"moyklass":"online"`).

## Что сделать на бэкенде ЛК

1. Скопировать [`leads.route.js`](./leads.route.js) в свой репо ЛК
   (например, `routes/leads.route.js`).
2. Подключить в `app.js` / `server.js`:
   ```js
   const leadsRoute = require('./routes/leads.route');
   app.post('/api/leads', express.json(), leadsRoute);
   ```
   Если у вас уже глобально включён `express.json()` — второй аргумент
   не нужен.
3. Убедиться, что `MOYKLASS_API_KEY` уже есть в env. По вашему health
   он точно есть (моуклас «online»). Если хочется направлять лиды в
   конкретный филиал/статус, дополнительно: `MOYKLASS_FILIAL_ID`,
   `MOYKLASS_STATUS_ID`.
4. CORS для домена `champion-footboll.ru` уже разрешён глобально на
   вашем сервере (`access-control-allow-origin: *`), отдельной правки
   не требуется.

## Что сделать здесь, в репо champion-footboll

URL `https://lk.champion-footboll.ru/api/leads` уже захардкожен как
дефолтный в [`src/app/pages/Signup.tsx`](../src/app/pages/Signup.tsx).
Если URL меняется — переопределите через env:

```bash
# .env.local в корне репозитория (gitignored)
VITE_LEADS_ENDPOINT=https://example.com/leads
```

После любого изменения формы или endpoint'а:

```bash
npm run deploy
```

## Проверка

После деплоя роута на ЛК:

```bash
curl -X POST https://lk.champion-footboll.ru/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"parentName":"Тест","phone":"+79991234567","childAge":"5-6 лет","source":"manual-test"}'
```

Ожидается `{"ok":true,"leadId":<число>}` и появление лида в MoyKlass.

## Если на ЛК уже есть свой MoyKlass-клиент

`leads.route.js` написан как самодостаточный — он сам делает auth и
кеширует токен на 23 часа. Если у вас уже есть свой `MoyKlassService` /
`MoyKlassClient` в кодовой базе ЛК, лучше вызывать его, а не дублировать
auth-логику. Подмените блок `getAccessToken` + `fetch /v1/company/leads`
на ваш существующий метод вроде `await moyklass.createLead({...})`.
