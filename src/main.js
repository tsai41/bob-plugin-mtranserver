var lang = require("./lang.js");

var cachedServerLangs = null;

function getApiUrl() {
  var url = ($option.apiUrl || "http://127.0.0.1:8989").trim();
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  return url;
}

function buildUrl(path) {
  var url = getApiUrl() + path;
  var token = ($option.apiToken || "").trim();
  if (token) {
    url += "?token=" + encodeURIComponent(token);
  }
  return url;
}

function buildHeaders() {
  var headers = { "Content-Type": "application/json" };
  var token = ($option.apiToken || "").trim();
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  return headers;
}

function httpGet(url, timeoutMs, cb) {
  $http.request({
    method: "GET",
    url: url,
    header: buildHeaders(),
    timeout: timeoutMs / 1000,
    handler: function (resp) {
      cb(resp);
    },
  });
}

function httpPost(url, body, timeoutMs, cb) {
  $http.request({
    method: "POST",
    url: url,
    header: buildHeaders(),
    body: body,
    timeout: timeoutMs / 1000,
    handler: function (resp) {
      cb(resp);
    },
  });
}

function fetchServerLanguages(cb) {
  if (cachedServerLangs) {
    cb(cachedServerLangs);
    return;
  }
  httpGet(buildUrl("/languages"), 5000, function (resp) {
    if (resp.error || !resp.data) {
      cb(null);
      return;
    }
    try {
      var data = typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
      if (Array.isArray(data)) {
        cachedServerLangs = data;
        cb(data);
        return;
      }
      if (data && Array.isArray(data.languages)) {
        cachedServerLangs = data.languages;
        cb(data.languages);
        return;
      }
    } catch (e) { /* ignored */ }
    cb(null);
  });
}

function supportLanguages() {
  return lang.supportedLanguages(cachedServerLangs);
}

function pluginValidate(completion) {
  httpGet(buildUrl("/health"), 5000, function (resp) {
    if (resp.error) {
      completion({
        result: false,
        error: {
          type: "network",
          message: "Cannot reach MTranServer at " + getApiUrl(),
          addition: String(resp.error),
        },
      });
      return;
    }
    completion({ result: true });
  });
}

function translate(query, completion) {
  var text = query.text || "";
  if (!text) {
    completion({
      error: { type: "missingParameter", message: "Empty source text." },
    });
    return;
  }

  fetchServerLanguages(function (serverLangs) {
    var from = lang.normalize(query.detectFrom, serverLangs);
    var to = lang.normalize(query.detectTo, serverLangs);

    var body = {
      from: from,
      to: to,
      text: text,
      html: false,
    };

    httpPost(buildUrl("/translate"), body, 15000, function (resp) {
      if (resp.error) {
        completion({
          error: {
            type: "network",
            message: "Translation request failed.",
            addition: String(resp.error),
          },
        });
        return;
      }

      try {
        var data = typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
      } catch (e) {
        completion({
          error: {
            type: "api",
            message: "Invalid JSON from MTranServer.",
            addition: String(resp.data).slice(0, 200),
          },
        });
        return;
      }

      if (!data) {
        completion({
          error: { type: "api", message: "Empty response from MTranServer." },
        });
        return;
      }

      if (data.error) {
        completion({
          error: {
            type: "api",
            message: data.error,
            addition: JSON.stringify(data),
          },
        });
        return;
      }

      var translated = data.result || data.translatedText || "";
      if (!translated) {
        completion({
          error: {
            type: "api",
            message: "No translated text in response.",
            addition: JSON.stringify(data),
          },
        });
        return;
      }

      completion({ result: { from: from, to: to, toParagraphs: [translated] } });
    });
  });
}

function pluginTimeoutInterval() {
  return 20;
}

module.exports = {
  supportLanguages: supportLanguages,
  translate: translate,
  pluginValidate: pluginValidate,
  pluginTimeoutInterval: pluginTimeoutInterval,
};
