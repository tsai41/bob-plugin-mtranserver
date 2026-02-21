/**
 * Language normalization for MTranServer Bob plugin.
 *
 * Aggressively maps Chinese variants so Traditional Chinese output
 * is never accidentally replaced by Simplified Chinese.
 */

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
  "yue": "zh-Hant",    // Cantonese: closest written form is Traditional
  "wyw": "zh-Hant",    // Classical Chinese: closest written form is Traditional
  "zh-hans": "zh-Hans",
  "zh-cn": "zh-Hans",
  "zh-sg": "zh-Hans",
  "zh": "zh-Hant",     // bare "zh" -> Traditional per user priority
};

var GENERAL_MAP = {
  "auto": "auto",
};

/** @param {string} bobCode  @param {string[]|null} serverLangs  @returns {string} */
function normalize(bobCode, serverLangs) {
  if (!bobCode || typeof bobCode !== "string") {
    return "auto";
  }

  var lower = bobCode.toLowerCase().trim();

  if (CHINESE_MAP.hasOwnProperty(lower)) {
    return CHINESE_MAP[lower];
  }

  if (GENERAL_MAP.hasOwnProperty(lower)) {
    return GENERAL_MAP[lower];
  }

  if (serverLangs && serverLangs.length > 0) {
    for (var i = 0; i < serverLangs.length; i++) {
      if (serverLangs[i].toLowerCase() === lower) {
        return serverLangs[i];
      }
    }
  }

  return bobCode;
}

/** @param {string[]|null} serverLangs  @returns {string[]} */
function supportedLanguages(serverLangs) {
  if (serverLangs && serverLangs.length > 0) {
    return serverLangs;
  }
  return FALLBACK_LANGUAGES.slice();
}

/** @param {string[]|null} serverLangs  @returns {Object[]} */
function buildLanguagePairs(serverLangs) {
  var langs = supportedLanguages(serverLangs);
  var pairs = [];
  for (var i = 0; i < langs.length; i++) {
    for (var j = 0; j < langs.length; j++) {
      if (i !== j) {
        pairs.push({ from: langs[i], to: langs[j] });
      }
    }
  }
  return pairs;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    normalize: normalize,
    supportedLanguages: supportedLanguages,
    buildLanguagePairs: buildLanguagePairs,
    FALLBACK_LANGUAGES: FALLBACK_LANGUAGES,
  };
}
