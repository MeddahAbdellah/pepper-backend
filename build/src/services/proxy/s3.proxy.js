"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const user_controller_1 = require("services/user/user.controller");
const helpers_1 = require("helpers/helpers");
const acl_1 = require("acls/acl");
class ProxyRoutes {
    constructor() {
        this._router = express_1.default.Router();
    }
    build() {
        this._assignRoute();
        return this._router;
    }
    _assignRoute() {
        this._router.route('/s3').post(acl_1.authorizeForUser, (0, helpers_1.checkParametersAndCallRoute)(user_controller_1.UserController.getUser));
    }
}
exports.default = new ProxyRoutes().build();
//# sourceMappingURL=s3.proxy.js.map