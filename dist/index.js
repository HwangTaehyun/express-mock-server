"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serverStart = serverStart;
exports.serverStop = serverStop;

require("colors");

var _config = _interopRequireDefault(require("./config"));

var _app = require("./app");

var _ws = _interopRequireDefault(require("ws"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  port
} = _config.default;
let server,
    wsServer = null;
/**
 * Method to start server.
 *
 * @param sources
 * @param {Object} serverConfig
 * @param serverConfig.controlApiUrl    ['/api/v1']
 * @param serverConfig.port             [8080]
 * @param serverConfig.webSocketEnabled false
 * @param serverConfig.cors false
 */

function serverStart(sources, serverConfig = {}) {
  const app = new _app.App(sources, serverConfig);
  const port = getServerPort(serverConfig);
  server = app.start(port, () => {
    console.log(`* Server port    ${port}`.yellow);
    console.log(`*************************`.yellow);
    console.log('Server START'.bgGreen.white);
  });

  if (serverConfig.cors) {
    console.log(`*************************`.yellow);
    console.log(`Cors Enabled`);
    app.initCors();
  }

  if (serverConfig.webSocketEnabled) {
    wsServer = startWebSocket(server);
    app.initWebSocketApi(wsServer);
  }

  return server;
}
/**
 * Method to stop server.
 */


function serverStop() {
  if (server) {
    server.close();
  }

  if (wsServer) {
    wsServer.close();
  }
}

function startWebSocket(server) {
  const wsServer = new _ws.default.Server({
    noServer: true
  });
  wsServer.on('connection', socket => {
    console.log('WebSocket client connected');
    socket.on('message', message => {
      console.log('WebSocket client message received');
      console.log(message);
    });
    socket.on('close', () => console.log('WebSocket client disconnected'));
  });
  server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request);
    });
  });
  return wsServer;
}

function getServerPort(serverConfig) {
  return serverConfig.port ? serverConfig.port : port;
}
//# sourceMappingURL=index.js.map