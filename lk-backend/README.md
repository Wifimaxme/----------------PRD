# lk-backend / leads route

Express-обработчик для приёма заявок с публичной формы записи
(`champion-footboll.ru/#/signup`) и создания лида в MoyKlass.

Файл лежит здесь, чтобы был под рукой и в основном репо. Запускаться он
должен **на бэкенде ЛК** (`lk.champion-footboll.ru`), у которого уже
есть рабочая интеграция с MoyKlass (видно из `/api/health`:
`"moyklass":"online"`).

## Что сделать

### 1. В админке MoyKlass

Должны существовать три кастомных поля у сущности «Лид» с такими именами:

- `Детский сад` — текстовое
- `Группа` — текстовое
- `Льгота` — текстовое или select со значениями
  «Многодетная семья», «Опекун», «Сотрудник ДОУ», «2+ детей в школе»

Если каких-то полей нет — заведите их в Настройках MoyKlass. Если
названия отличаются — пропишите фактические в env (см. ниже).

### 2. На бэкенде ЛК

1. Скопировать [`leads.route.js`](./leads.route.js) в репо ЛК
   (например, `routes/leads.route.js`).
2. Подключить:
   ```js
   const leadsRoute = require('./routes/leads.route');
   app.post('/api/leads', express.json(), leadsRoute);
   ```
   Если `express.json()` уже подключён глобально — второй аргумент
   не нужен.
3. Env vars:
   - `MOYKLASS_API_KEY` — уже есть.
   - (опц.) `MOYKLASS_FILIAL_ID`, `MOYKLASS_STATUS_ID` — куда сразу
     класть лид.
   - (опц.) `MOYKLASS_CF_KINDERGARTEN_NAME`, `MOYKLASS_CF_GROUP_NAME`,
     `MOYKLASS_CF_PRIVILEGE_NAME` — если в MoyKlass поля называются
     иначе, пропишите фактические имена.
4. Передеплойте ЛК.

CORS для `champion-footboll.ru` уже разрешён глобально на вашем сервере
(`access-control-allow-origin: *`), отдельной правки не требуется.

### Как работает discovery

При первом запросе бэкенд дёргает `GET /v1/company/customFields`
(или `leadCustomFields`) с accessToken'ом, ищет поля по имени и кеширует
их id на час. Если каких-то полей не нашлось — лид всё равно создастся
со стандартными `name`/`phone`/`dob`, а значения «потерянных» полей
запишутся в `description` лида с пометкой о том, что поле нужно завести
в CRM. В ответе вернётся `warning`.

## Frontend конфиг

URL `https://lk.champion-footboll.ru/api/leads` уже захардкожен как
дефолт в [`src/app/pages/Signup.tsx`](../src/app/pages/Signup.tsx).
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
  -d '{
    "childName":"Тестик",
    "phone":"+79991234567",
    "dob":"2020-05-15",
    "kindergarten":"№123",
    "group":"средняя",
    "privilege":"Многодетная семья"
  }'
```

Ожидается `{"ok":true,"leadId":<число>}` (или с полем `warning`, если
какое-то кастомное поле в MoyKlass не нашлось). В CRM появится лид с
именем «Тестик», ДР 2020-05-15, телефоном и заполненными кастомными
полями.

## Если на ЛК уже есть свой MoyKlass-клиент

`leads.route.js` написан как самодостаточный — он сам делает auth и
кеширует токен на 23 часа, а field id'шники — на час. Если у вас уже
есть свой `MoyKlassService` / `MoyKlassClient` в кодовой базе ЛК, лучше
вызывать его, а не дублировать auth-логику. Подмените блоки
`getAccessToken` + `fetch /v1/company/leads` на ваш существующий метод
вроде `await moyklass.createLead({...})`.
