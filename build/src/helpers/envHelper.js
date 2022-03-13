"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Env;
(function (Env) {
    Env["Local"] = "local";
    Env["Test"] = "test";
    Env["Prod"] = "prod";
})(Env || (Env = {}));
class EnvHelper {
    static isProd() {
        return process.env.NODE_ENV === Env.Prod;
    }
    static isLocal() {
        return process.env.NODE_ENV === Env.Local;
    }
    static isTest() {
        return process.env.NODE_ENV === Env.Test;
    }
}
exports.default = EnvHelper;
//# sourceMappingURL=envHelper.js.map