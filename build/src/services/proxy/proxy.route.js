"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const helpers_1 = require("helpers/helpers");
const proxy_controller_1 = require("./proxy.controller");
class ProxyRoutes {
    constructor() {
        this._router = express_1.default.Router();
    }
    build() {
        this._assignRoute();
        return this._router;
    }
    _assignRoute() {
        this._router.route('/s3').post((0, helpers_1.checkParametersAndCallRoute)(proxy_controller_1.ProxyController.uploadImageToS3));
    }
}
exports.default = new ProxyRoutes().build();
//# sourceMappingURL=proxy.route.js.map