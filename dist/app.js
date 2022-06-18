"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _config = _interopRequireDefault(require("./config"));

var _control = require("./api/control");

var _sourcesParser = require("./core/sources-parser");

var _sourcesRouter = require("./core/sources-router");

var _recording = require("./api/recording");

var _apiRecorder = require("./api/recording/api-recorder");

var _websocket = require("./api/websocket");

var _cors = _interopRequireDefault(require("cors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  isLogEnabled
} = _config.default;

class App {
  constructor(sources, serverConfig) {
    this.parser = new _sourcesParser.SourcesParser(sources);
    this.apiUrl = this.getApiUrl(serverConfig);
    this.app = (0, _express.default)();
    console.log('******* CONFIG **********'.yellow);
    this.initMiddleware();
    this.initControlApi();
    this.initRecordingApi();
    this.initMocks();
  }

  initMiddleware() {
    this.app.use(_bodyParser.default.text());
    this.app.use(_bodyParser.default.json());
    this.app.use((0, _apiRecorder.apiRecorder)(this.apiUrl));
    this.initLogger();
  }

  initCors() {
    this.app.use((0, _cors.default)({
      origin: '*'
    }));
  }

  initMocks() {
    const router = new _sourcesRouter.SourcesRouter(this.parser);
    router.registerSources(this.app, isLogEnabled);
  }
  /**
   *  Method to start logger of requests
   *    Actual format
   *      0.230 ms GET 200 /some/url/
   *    More option
   *      https://github.com/expressjs/morgan
   */


  initLogger() {
    if (isLogEnabled) {
      this.app.use((0, _morgan.default)(':response-time ms :method :status :url'));
    }
  }

  initControlApi() {
    this.app.use(this.apiUrl, (0, _control.controlApi)(this.parser));
  }

  initRecordingApi() {
    this.app.use(this.apiUrl, (0, _recording.recordingApi)());
  }

  initWebSocketApi(wsServer) {
    this.app.use(this.apiUrl, (0, _websocket.websocketApi)(wsServer));
  }

  getApiUrl({
    controlApiUrl
  } = {}) {
    return controlApiUrl ? controlApiUrl : '/api/v1';
  }

  start(port, callback) {
    return this.app.listen(port, callback);
  }

}

exports.App = App;
//# sourceMappingURL=app.js.map