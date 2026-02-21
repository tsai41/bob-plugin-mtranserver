# bob-plugin-mtranserver

Bob translation plugin for self-hosted [MTranServer](https://github.com/xxnuo/MTranServer).

## Install

1. Download the latest `*.bobplugin` file from [Releases](https://github.com/tsai41/bob-plugin-mtranserver/releases).
2. Double-click the file to install in Bob.
3. Open Bob **Preferences > Translation > Services**, enable **MTranServer Translate**.
4. Set the **API URL** to your MTranServer address (e.g. `http://192.168.1.100:8989`).
5. If your server requires authentication, fill in the **Token** field.

## Manual Install

```bash
git clone https://github.com/tsai41/bob-plugin-mtranserver.git
cd bob-plugin-mtranserver
zip -r mtranserver.bobplugin info.json main.js lang.js
open mtranserver.bobplugin
```

## Configuration

| Option    | Description                          | Default                   |
|-----------|--------------------------------------|---------------------------|
| API URL   | MTranServer base URL (no trailing /) | `http://127.0.0.1:8989`  |
| Token     | Optional auth token                  | (empty)                   |

## MTranServer API Endpoints Used by This Plugin

These are **server-side endpoints** that the Bob plugin calls on your MTranServer instance.

| Endpoint       | Method | Purpose                    |
|----------------|--------|----------------------------|
| `/health`      | GET    | Validate server connection |
| `/languages`   | GET    | Discover supported langs   |
| `/translate`   | POST   | Translate text             |

## Bob Plugin Contract

This plugin exposes the standard Bob plugin entry functions:

- `supportLanguages()`
- `translate(query, completion)`
- `pluginValidate(completion)`
- `pluginTimeoutInterval()`

### `/translate` request body

```json
{
  "from": "en",
  "to": "zh-Hant",
  "text": "Hello",
  "html": false
}
```

### `/translate` response

```json
{
  "result": "..."
}
```

## Chinese Language Mapping

Bob sends various Chinese locale codes. This plugin normalizes them before
calling MTranServer to ensure correct script output:

| Bob code                          | MTranServer code |
|-----------------------------------|------------------|
| `zh-TW`, `zh-HK`, `zh-Hant`, `zh` | `zh-Hant`        |
| `zh-CN`, `zh-Hans`               | `zh-Hans`        |

Bare `zh` defaults to `zh-Hant` (Traditional) by design.

## License

MIT
