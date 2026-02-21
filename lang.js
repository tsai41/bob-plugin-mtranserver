var FALLBACK_LANGUAGES = [
  "en",
  "zh-Hans",
  "zh-Hant",
  "ja",
  "ko",
  "fr",
  "de",
  "es",
  "pt",
  "ru",
  "it",
  "nl",
  "pl",
  "ar",
  "th",
  "vi",
  "id",
  "tr",
  "uk",
  "cs",
];

var CHINESE_MAP = {
  "zh-hant": "zh-Hant",
  "zh-tw": "zh-Hant",
  "zh-hk": "zh-Hant",
  "zh-mo": "zh-Hant",
  "yue": "zh-Hant",
  "wyw": "zh-Hant",
  "zh-hans": "zh-Hans",
  "zh-cn": "zh-Hans",
  "zh-sg": "zh-Hans",
  "zh": "zh-Hant",
};

var GENERAL_MAP = {
  auto: "auto",
};

function normalize(bobCode, serverLangs) {
  if (!bobCode || typeof bobCode !== "string") {
    return "auto";
  }

  var lower = bobCode.toLowerCase().trim();

  if (Object.prototype.hasOwnProperty.call(CHINESE_MAP, lower)) {
    return CHINESE_MAP[lower];
  }

  if (Object.prototype.hasOwnProperty.call(GENERAL_MAP, lower)) {
    return GENERAL_MAP[lower];
  }

  if (serverLangs && serverLangs.length > 0) {
    for (var i = 0; i < serverLangs.length; i += 1) {
      if (serverLangs[i].toLowerCase() === lower) {
        return serverLangs[i];
      }
    }
  }

  return bobCode;
}

function supportedLanguages(serverLangs) {
  if (serverLangs && serverLangs.length > 0) {
    return serverLangs;
  }
  return FALLBACK_LANGUAGES.slice();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    normalize: normalize,
    supportedLanguages: supportedLanguages,
  };
}
