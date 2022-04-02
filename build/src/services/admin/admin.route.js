"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const admin_controller_1 = require("services/admin/admin.controller");
const helpers_1 = require("helpers/helpers");
class AdminRoutes {
    constructor() {
        this._router = express_1.default.Router();
    }
    build() {
        this._assignRoute();
        return this._router;
    }
    _assignRoute() {
        this._router.route('/organizer').put((0, helpers_1.checkParametersAndCallRoute)(admin_controller_1.AdminController.updateStatus));
    }
}
exports.default = new AdminRoutes().build();
//# sourceMappingURL=admin.route.js.map