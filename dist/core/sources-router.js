"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SourcesRouter = void 0;

var _constants = require("../constants");

var _requestHandler = require("./request-handler");

class SourcesRouter {
  /**
   * @param {SourcesParser} parser
   */
  constructor(parser) {
    this.parser = parser;
  }

  registerSources(app, isLogEnabled) {
    const map = this.parser.getMap();
    Object.keys(map).forEach(path => {
      this.registerGET(app, path, isLogEnabled);
      this.registerPOST(app, path, isLogEnabled);
      this.registerPUT(app, path, isLogEnabled);
      this.registerDELETE(app, path, isLogEnabled);
      this.registerPATCH(app, path, isLogEnabled);
    });
  }

  registerGET(app, path, map, isLogEnabled) {
    const pathItem = this.parser.getMap()[path];
    const gets = pathItem[_constants.methods.GET];

    if (gets) {
      gets.forEach(() => {
        app.get(path, (req, res, next) => {
          (0, _requestHandler.requestHandler)(this.parser, req, res, next);
        });
        this.logRegisteredPath(isLogEnabled, _constants.methods.GET, path);
      });
    }
  }

  registerPOST(app, path, map, isLogEnabled) {
    const pathItem = this.parser.getMap()[path];
    const posts = pathItem[_constants.methods.POST];

    if (posts) {
      posts.forEach(() => {
        app.post(path, (req, res, next) => {
          (0, _requestHandler.requestHandler)(this.parser, req, res, next);
        });
        this.logRegisteredPath(isLogEnabled, _constants.methods.POST, path);
      });
    }
  }

  registerPUT(app, path, map, isLogEnabled) {
    const pathItem = this.parser.getMap()[path];
    const puts = pathItem[_constants.methods.PUT];

    if (puts) {
      puts.forEach(() => {
        app.put(path, (req, res, next) => {
          (0, _requestHandler.requestHandler)(this.parser, req, res, next);
        });
        this.logRegisteredPath(isLogEnabled, _constants.methods.PUT, path);
      });
    }
  }

  registerDELETE(app, path, map, isLogEnabled) {
    const pathItem = this.parser.getMap()[path];
    const deletes = pathItem[_constants.methods.DELETE];

    if (deletes) {
      deletes.forEach(() => {
        app.delete(path, (req, res, next) => {
          (0, _requestHandler.requestHandler)(this.parser, req, res, next);
        });
        this.logRegisteredPath(isLogEnabled, _constants.methods.DELETE, path);
      });
    }
  }

  registerPATCH(app, path, map, isLogEnabled) {
    const pathItem = this.parser.getMap()[path];
    const patches = pathItem[_constants.methods.PATCH];

    if (patches) {
      patches.forEach(() => {
        app.patch(path, (req, res, next) => {
          (0, _requestHandler.requestHandler)(this.parser, req, res, next);
        });
        this.logRegisteredPath(isLogEnabled, _constants.methods.PATCH, path);
      });
    }
  }
  /**
   *  Method to log registered path
   */


  logRegisteredPath(isLogEnabled, method, path) {
    if (isLogEnabled) {
      console.log(`REG ${method} ${path}`.magenta);
    }
  }

}

exports.SourcesRouter = SourcesRouter;
//# sourceMappingURL=sources-router.js.map