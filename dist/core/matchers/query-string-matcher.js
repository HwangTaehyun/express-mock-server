"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMatchingResultByQueryStrings = exports.getMatchesByQueryString = void 0;

var _MatchItem = _interopRequireDefault(require("./MatchItem"));

var _constants = require("../../constants");

var _MatchingResult = _interopRequireWildcard(require("./MatchingResult"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TYPE_SPECIFIC_REGEX = 'SPECIFIC_REGEX';

const isEqualQueryParamValues = (masterValues, slaveValues) => {
  if (!Array.isArray(masterValues) || !Array.isArray(slaveValues)) {
    return false;
  }

  if (masterValues.length <= 1 || slaveValues.length <= 1) {
    return false;
  }

  return [...masterValues].sort().join('') === [...slaveValues].sort().join('');
};
/**
 *                  exist     dont      exist     dont
 *  req/master        0         1         0         1
 *  bundle/slave      0         0         1         1
 *  result =          strict    default   no        subset/no
 *
 *  @param {Object} masterQS          request
 *  @param {Array.<Object>} slaveQS   bundle
 */


const getMatchingResultByQueryStrings = (masterQS, slaveQS) => {
  let isMasterExist = !!masterQS && JSON.stringify(masterQS) !== '{}';
  let isSlaveExist = !!slaveQS; // console.log('+++++++++++'.green);
  // console.log(masterQS);
  // console.log(slaveQS);
  // console.log('+++++++++++'.blue);

  if (!isMasterExist && !isSlaveExist) return _MatchingResult.MATCH_STRICT;
  if (!isMasterExist && isSlaveExist) return _MatchingResult.MATCH_NO;
  if (isMasterExist && !isSlaveExist) return _MatchingResult.MATCH_DEFAULT;
  let result = null;
  let countOfMatches = 0;
  let countOfMatchesUnspecific = 0;
  slaveQS.forEach(({
    name,
    values,
    type
  }) => {
    if (!masterQS[name]) {
      result = _MatchingResult.MATCH_NO;
    } else {
      let isContained = values.indexOf(masterQS[name]) !== -1;
      let isSpecific = values.indexOf(_constants.REG_ALL) === -1;

      if (type === TYPE_SPECIFIC_REGEX) {
        isSpecific = true;

        if (!isContained) {
          values.forEach(value => {
            let regex = new RegExp(value); // console.log(name);
            // console.log(regex);
            // console.log(masterQS[name]);
            // console.log('regex.test(masterQS[name]) ' +regex.test(masterQS[name]));

            if (regex.test(masterQS[name])) {
              isSpecific = false;
            }
          });
        }
      }

      if (isSpecific && !isContained) {
        if (isEqualQueryParamValues(masterQS[name], values)) {
          countOfMatches++;
        } else {
          result = _MatchingResult.MATCH_NO;
        }
      } else {
        if (!isSpecific) countOfMatchesUnspecific++;
        countOfMatches++;
      }
    }
  });
  if (result !== null) return result;
  let masterQSLength = Object.keys(masterQS).length;
  let slaveQSLength = slaveQS.length;
  if (slaveQSLength === countOfMatches && countOfMatches === masterQSLength) return _MatchingResult.MATCH_STRICT;
  return new _MatchingResult.default(_MatchingResult.MATCH_TYPE.SUBSET, countOfMatches, countOfMatchesUnspecific);
};

exports.getMatchingResultByQueryStrings = getMatchingResultByQueryStrings;

const getMatchesByQueryString = (req, definitions) => {
  let matches = [];
  definitions.forEach(record => {
    // console.log(req.query);
    // console.log(record.queryStringParameters);
    let result = getMatchingResultByQueryStrings(req.query, record.queryStringParameters); // console.log('result');
    // console.log(result);

    if (!result.isNo()) {
      matches.push(new _MatchItem.default(record, result));
    }
  });
  return matches;
};

exports.getMatchesByQueryString = getMatchesByQueryString;
//# sourceMappingURL=query-string-matcher.js.map