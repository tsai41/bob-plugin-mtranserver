# Test Payloads for MTranServer Bob Plugin

## Health Check

```
GET http://127.0.0.1:8989/health
```

Expected: 200 OK.

## Language List

```
GET http://127.0.0.1:8989/languages
```

Expected: JSON array of language codes or `{ "languages": [...] }`.

## Translate (English to Traditional Chinese)

```
POST http://127.0.0.1:8989/translate
Content-Type: application/json

{
  "q": "Hello, world!",
  "source": "en",
  "target": "zh-Hant"
}
```

Expected: `{ "result": "..." }`.

## Translate (Simplified to Traditional Chinese)

```
POST http://127.0.0.1:8989/translate
Content-Type: application/json

{
  "q": "软件工程",
  "source": "zh-Hans",
  "target": "zh-Hant"
}
```

Expected: `{ "translatedText": "軟體工程" }` (or similar Traditional output).

## Translate with Token

```
POST http://127.0.0.1:8989/translate?token=YOUR_TOKEN
Content-Type: application/json

{
  "q": "Good morning",
  "source": "en",
  "target": "ja"
}
```

## Bob Query Simulation

The plugin receives queries from Bob like:

```json
{
  "text": "Hello",
  "detectFrom": "en",
  "detectTo": "zh-TW"
}
```

The plugin normalizes `zh-TW` to `zh-Hant` before sending to MTranServer.

Key normalizations:
- `zh-TW`, `zh-HK`, `zh-Hant`, `zh` -> `zh-Hant`
- `zh-CN`, `zh-Hans` -> `zh-Hans`
