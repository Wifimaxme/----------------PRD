# lk-backend / leads route

Express-обработчик для приёма заявок с публичной формы записи
(`champion-footboll.ru/#/signup`) и создания ученика (он же лид) в
MoyKlass.

## Главное про модель данных MoyKlass

Это критично, потому что в первой версии я промахнулся. В MoyKlass API
**нет сущности «лид»** — лиды и клиенты это один и тот же «ученик»
(`user`), различаются только `clientStateId` (статус). Запись создаётся
через **`POST /v1/company/users`**, а не через `/leads`.

Кастомные поля в MoyKlass называются **«признаки ученика»**
(`UserAttribute`). У каждого признака есть числовой `id` и строковый
`alias`, и значения можно слать любым из двух способов:

```json
{ "attributes": { "birthday": "2020-05-15" } }   // по alias
{ "attributes": { "1": "2020-05-15" } }          // по id
```

Алиасы для этой CRM (по словам оператора):

- `birthday` — день рождения ребёнка
- `nomer_sada` — номер детского сада
- `gruppa_v_sadu` — группа в саду
- `lgota` — льготная категория

## Что сделать

### 1. На бэкенде ЛК

1. Скопировать [`leads.route.js`](./leads.route.js) в репо ЛК
   (например, `routes/leads.route.js`).
2. Подключить:
   ```js
   const leads = require('./routes/leads.route');
   app.post('/api/leads',       express.json(), leads);          // создание
   app.get ('/api/leads/probe',                 leads.probe);    // диагностика
   ```
   Если `express.json()` уже подключён глобально — второй аргумент
   не нужен.
3. Env vars (фактически нужен только первый):
   - `MOYKLASS_API_KEY` — уже есть на сервере.
   - (опц.) `MOYKLASS_FILIAL_ID` — если все заявки должны падать в
     конкретный филиал.
   - (опц.) `MOYKLASS_CLIENT_STATE_ID` — если нужно сразу присваивать
     статус (например, «новая заявка»).
   - (опц.) `MOYKLASS_ATTR_BIRTHDAY`, `MOYKLASS_ATTR_KINDERGARTEN`,
     `MOYKLASS_ATTR_GROUP`, `MOYKLASS_ATTR_PRIVILEGE` — переопределить
     алиасы признаков, если в CRM они называются иначе.
4. Передеплойте ЛК.

### 2. Проверка алиасов

Сразу после деплоя дёрните диагностический эндпоинт:

```bash
curl https://lk.champion-footboll.ru/api/leads/probe
```

Ответ — список признаков ученика из CRM плюс алиасы, которые ждёт код:

```json
{
  "expectedAliases": {
    "birthday": "birthday",
    "kindergarten": "nomer_sada",
    "group": "gruppa_v_sadu",
    "privilege": "lgota"
  },
  "attributes": [
    { "id": 1, "alias": "birthday", "name": "День рождения", "type": "date" },
    { "id": 5, "alias": "nomer_sada", "name": "Номер сада", "type": "string" },
    ...
  ]
}
```

Сверьте `expectedAliases` с фактическими `alias` в `attributes`. Если
расходятся — пропишите фактические значения в env-переменных
`MOYKLASS_ATTR_*`.

### 3. Тестовая заявка

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

Ожидается `{"ok":true,"userId":<число>}`. В MoyKlass появится ученик с
именем «Тестик», телефоном и заполненными признаками.

Если что-то пойдёт не так, сервер вернёт `502` с телом ошибки от
MoyKlass — там будет видно, какое именно поле не нравится. Лог в
консоли сервера покажет полный отправленный payload.

## Frontend конфиг

URL `https://lk.champion-footboll.ru/api/leads` уже захардкожен как
дефолт в [`src/app/pages/Signup.tsx`](../src/app/pages/Signup.tsx).
Переопределить можно через `.env.local`:

```bash
VITE_LEADS_ENDPOINT=https://example.com/leads
```

После любого изменения формы:

```bash
npm run deploy
```

## Если на ЛК уже есть свой MoyKlass-клиент

Файл написан как самодостаточный — он сам делает auth и кеширует токен
на 23 часа. Если у вас уже есть готовый `MoyKlassService` /
`MoyKlassClient`, лучше вызвать его внутри `create`, а не дублировать
auth-логику. Строки `getAccessToken` + `moyklassFetch` смело меняйте на
`await moyklass.createUser({ name, phone, attributes, ... })`.
