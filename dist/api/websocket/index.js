"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.websocketApi = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router({});

const websocketApi = wsServer => {
  router.post('/websocket/clients/message', (request, response) => {
    wsServer.clients.forEach(ws => {
      ws.send(JSON.stringify(request.body));
    });
    response.send({
      status: true
    });
  });
  router.post('/websocket/clients/disconnect', (request, response) => {
    wsServer.clients.forEach(ws => {
      ws.close();
    });
    response.send({
      status: true
    });
  });
  return router;
};

exports.websocketApi = websocketApi;
//# sourceMappingURL=index.js.map