"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const party_controller_1 = require("services/party/party.controller");
const helpers_1 = require("helpers/helpers");
const acl_1 = require("acls/acl");
class PartyRoutes {
    constructor() {
        this._router = express_1.default.Router();
    }
    build() {
        this._assignRoute();
        return this._router;
    }
    _assignRoute() {
        this._router.route('/').get(acl_1.authorizeForUser, (0, helpers_1.checkParametersAndCallRoute)(party_controller_1.PartyController.getPartiesThatUserCanGoTo));
    }
}
exports.default = new PartyRoutes().build();
//# sourceMappingURL=party.route.js.map