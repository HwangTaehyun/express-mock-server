"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recordingApi = void 0;

var _express = _interopRequireDefault(require("express"));

var _apiRecorder = require("./api-recorder");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router({});

const recordingApi = () => {
  router.post('/recording/start', (req, res) => {
    const uuid = (0, _apiRecorder.startNewRecording)();
    res.send({
      id: uuid
    });
  });
  router.post('/recording/:id/stop', (req, res) => {
    const recording = (0, _apiRecorder.stopRecording)(req.params.id);

    if (!recording) {
      res.status(404).send('The monitoring with given ID was not found.');
    }

    res.send(recording);
  });
  return router;
};

exports.recordingApi = recordingApi;
//# sourceMappingURL=index.js.map