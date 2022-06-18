"use strict";

var _sourcesParser = require("./sources-parser");

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('source-parser', () => {
  it('should parse source', () => {
    // given
    const sources = [[{
      request: {
        method: 'GET',
        path: '/api/test'
      },
      response: {
        statusCode: 200,
        body: JSON.stringify({
          key: 'value'
        })
      }
    }]]; // when

    const parser = new _sourcesParser.SourcesParser(sources); // then

    _assert.default.equal(Object.keys(parser.map).length, 1);

    _assert.default.equal(Object.keys(parser.map)[0], '/api/test');
  });
});
//# sourceMappingURL=sources-parser.spec.js.map