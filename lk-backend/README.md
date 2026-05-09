# lk-backend / leads route

Express-обработчик для приёма заявок с публичной формы записи
(`champion-footboll.ru/#/signup`) и создания ученика (он же лид) в
MoyKlass.

## Реальная схема CRM (проверено по API)

В MoyKlass нет сущности «лид» — лиды и клиенты это один объект «ученик»
(`user`), они различаются только статусом (`clientStateId`). Создание:

```
POST /v1/company/users
```

Топ-уровень тела запроса использует `name` и `phone`. Все остальные
поля идут в `attributes` — это **массив объектов**, не объект-словарь:

```json
{
  "name": "Михаил",
  "phone": "+79991234567",
  "attributes": [
    { "attributeAlias": "birthday",      "value": "2020-05-15" },
    { "attributeAlias": "nomer_sada",    "value": 123 },
    { "attributeAlias": "gruppa_v_sadu", "value": "средняя" },
    { "attributeAlias": "client_type",   "value": [26942] }
  ]
}
```

### Признаки ученика (custom fields), которые используем

| alias            | id    | type        | используем для           |
|------------------|-------|-------------|--------------------------|
| `birthday`       | 1     | date        | дата рождения ребёнка    |
| `nomer_sada`     | 9160  | number      | номер сада (только цифры)|
| `gruppa_v_sadu`  | 9158  | string      | группа в саду            |
| `client_type`    | 4     | multiselect | льготная категория       |

### Варианты `client_type` (он же «Льгота»)

| variant id | название       | соответствует на форме       |
|-----------:|----------------|------------------------------|
| 26942      | Многодетный    | «Многодетная семья»          |
| 26943      | СВО            | (на форме нет)               |
| 40101      | Сотрудник      | «Сотрудник детского сада»    |
| 40102      | 2 детей        | «2+ детей в нашей школе»     |
| 40103      | Опекун         | «Опекун»                     |

В коде маппинг лежит в константе `CLIENT_TYPE_VARIANT_IDS`. Если в
админке появится новый вариант — добавьте его и в эту константу.

## Что сделать на бэкенде ЛК

1. Скопировать [`leads.route.js`](./leads.route.js) в репо ЛК
   (например, `routes/leads.route.js`).
2. Подключить:

   ```js
   const leads = require('./routes/leads.route');
   app.post('/api/leads',       express.json(), leads);
   app.get ('/api/leads/probe',                 leads.probe);
   ```

   Если `express.json()` уже глобально — второй аргумент не нужен.
3. Env vars:
   - `MOYKLASS_API_KEY` — уже есть на сервере.
   - (опц.) `MOYKLASS_FILIAL_ID` — id филиала по умолчанию.
   - (опц.) `MOYKLASS_CLIENT_STATE_ID` — статус по умолчанию.
4. Передеплойте ЛК.

## Проверка

### 1. Диагностика — что реально в CRM

```
curl https://lk.champion-footboll.ru/api/leads/probe
```

Вернёт сводку: какие алиасы код ждёт, какие варианты `client_type`
захардкожены, и фактическое состояние из CRM. Если что-то разъехалось
— видно сразу.

### 2. Тестовая заявка

```bash
curl -X POST https://lk.champion-footboll.ru/api/leads \
  -H 'Content-Type: application/json' \
  -d '{
    "childName":"Тестик",
    "phone":"+79991234567",
    "dob":"2020-05-15",
    "kindergarten":"123",
    "group":"средняя",
    "privilege":"Многодетный"
  }'
```

Ожидается `{"ok":true,"userId":<число>}`. В CRM появится ученик с
именем «Тестик», телефоном, заполненными признаками и галочкой
«Многодетный» в типе клиента.

При ошибке роут отдаёт `502` с телом ответа MoyKlass — там сразу
видно, какое поле не нравится. Полный отправленный payload пишется в
логи сервера.

## Frontend конфиг

URL `https://lk.champion-footboll.ru/api/leads` уже захардкожен как
дефолт в [`src/app/pages/Signup.tsx`](../src/app/pages/Signup.tsx).
Переопределить можно через `.env.local`:

```
VITE_LEADS_ENDPOINT=https://example.com/leads
```

## Если на ЛК уже есть свой MoyKlass-клиент

Файл написан как самодостаточный — он сам делает auth и кеширует токен
на 23 часа. Если у вас уже есть готовый `MoyKlassService` /
`MoyKlassClient`, лучше вызвать его внутри `create`, а не дублировать
auth-логику. Строки `getAccessToken` + `moyklassFetch('/v1/company/users')`
смело меняйте на `await moyklass.createUser({ name, phone, attributes })`.
