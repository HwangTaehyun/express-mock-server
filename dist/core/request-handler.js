"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestHandler = void 0;

var _httpStatusCodes = require("http-status-codes");

var _constants = require("../constants");

var _utils = require("./utils");

var _httpPostMatcher = require("./matchers/http-post-matcher");

var _httpGetMatcher = require("./matchers/http-get-matcher");

const APPLICATION_JSON = 'application/json';

const sendResponse = (response, res, next) => {
  if (response.file) {
    const {
      type,
      path
    } = response.file;

    if (!type) {
      res.status(_httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR).send('File type has to be specified!').end();
      return;
    }

    if (!path) {
      res.status(_httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR).send('File path has to be specified!').end();
      return;
    }

    res.status(response.statusCode).type(type);
    res.sendFile(path, {
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }, function (err) {
      if (err) {
        next(err);
      } else {
        console.log('Sent:', path);
      }
    });
  } else {
    res.send(response.body);
  }
};

const requestHandler = (sourcesParser, req, res, next) => {
  let method = req.method;
  let path = req.route.path;
  let definitions = sourcesParser.getMap()[path][method]; // console.log(method);
  // console.log(req.body);

  let response = null;
  let matchedRecord = null;

  if (definitions.length === 1) {
    matchedRecord = definitions[0];
    response = matchedRecord.response;
  } else {
    switch (method) {
      case _constants.methods.POST:
        {
          matchedRecord = (0, _httpPostMatcher.matchRecordPost)(req, definitions);
          break;
        }

      case _constants.methods.GET:
      case _constants.methods.PUT:
      case _constants.methods.DELETE:
      case _constants.methods.PATCH:
      default:
        {
          matchedRecord = (0, _httpGetMatcher.matchRecordGet)(req, definitions);
        }
    }

    if (matchedRecord !== null) {
      response = matchedRecord.response;
    }

    if (response === null) {
      console.log('ERR no reaponse but why?'.bgRed.white);
      console.log('I know this URL but no match for parameters.'.bgBlue.white);
      console.log(`method ${method}    path ${path}`);
      console.log('QUERY'.yellow);
      console.log(req.query);
      console.log('BODY'.yellow);
      console.log(req.body);
      console.log('bundle'.yellow); // myLog(bundle);

      res.status(_httpStatusCodes.StatusCodes.NOT_FOUND).send('NOT FOUND - no reaponse but why? Look to console.').end();
      return;
    }
  }

  if ((0, _utils.isFunction)(response)) {
    response = response(req.params, req.query, req.body);
  }

  if (!!response.headers) {
    response.headers.forEach(headerItem => {
      res.setHeader(headerItem['name'], headerItem['values'][0]);
    });
  }

  res.status(response.statusCode).type(response.contentType || APPLICATION_JSON);

  if (response.delay) {
    setTimeout(() => {
      sendResponse(response, res, next);
    }, response.delay);
  } else {
    sendResponse(response, res, next);
  }
};

exports.requestHandler = requestHandler;
//# sourceMappingURL=request-handler.js.map