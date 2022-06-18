"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.controlApi = void 0;

var _express = _interopRequireDefault(require("express"));

var _httpStatusCodes = require("http-status-codes");

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router({});

const {
  isLogEnabled
} = _config.default;

const controlApi = sourcesParser => {
  router.post('/set', (req, res) => {
    if (isLogEnabled) {
      console.log('API set new values'.green);
    }

    req.body.forEach(record => {
      // console.log('new record is >');
      // console.log(JSON.stringify(record, null, "  "));
      // console.log('< new record is');
      sourcesParser.switchRecord(record);
    });
    res.status(_httpStatusCodes.StatusCodes.ACCEPTED).end();
  });
  router.post('/reset', (req, res) => {
    if (isLogEnabled) {
      console.log('API Reset'.green);
    }

    sourcesParser.resetMap();
    res.status(_httpStatusCodes.StatusCodes.ACCEPTED).end();
  });
  return router;
};

exports.controlApi = controlApi;
//# sourceMappingURL=control.js.map