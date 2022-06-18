"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchRecordGet = void 0;

var _queryStringMatcher = require("./query-string-matcher");

const matchRecordGet = (req, definitions) => {
  let matches = (0, _queryStringMatcher.getMatchesByQueryString)(req, definitions);
  matches.sort((a, b) => {
    return b.result.compare(a.result);
  }); // console.log('+++++++++++++++++');
  // myLog(matches);

  if (matches.length === 0) return null;
  return matches[0].record;
};

exports.matchRecordGet = matchRecordGet;
//# sourceMappingURL=http-get-matcher.js.map