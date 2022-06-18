"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopRecording = exports.startNewRecording = exports.apiRecorder = void 0;

var _uuid = require("uuid");

const recordingStore = {};
let isRecordingActive = false;

const isNotRecordingApiPath = (apiUrl, path) => {
  return path.indexOf(`${apiUrl}/recording/`) === -1;
};

const startNewRecording = () => {
  const uuid = (0, _uuid.v1)();
  recordingStore[uuid] = [];
  isRecordingActive = true;
  return uuid;
};

exports.startNewRecording = startNewRecording;

const stopRecording = uuid => {
  const recording = recordingStore[uuid];
  delete recordingStore[uuid];
  isRecordingActive = Object.keys(recordingStore).length > 0;
  return recording;
};

exports.stopRecording = stopRecording;

const apiRecorder = apiUrl => {
  return (req, res, next) => {
    if (isRecordingActive && isNotRecordingApiPath(apiUrl, req.path)) {
      const originalSend = res.send;

      res.send = function (body) {
        originalSend.call(this, body);
        Object.keys(recordingStore).forEach(recordUuid => {
          recordingStore[recordUuid].push({
            url: req.baseUrl,
            path: req.path,
            method: req.method,
            params: req.params,
            query: req.query,
            body: req.body,
            responseBody: !body ? {} : JSON.parse(body)
          });
        });
      };
    }

    next();
  };
};

exports.apiRecorder = apiRecorder;
//# sourceMappingURL=api-recorder.js.map