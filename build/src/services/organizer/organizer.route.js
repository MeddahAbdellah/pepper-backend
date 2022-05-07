"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const organizer_controller_1 = require("services/organizer/organizer.controller");
const helpers_1 = require("helpers/helpers");
const acl_1 = require("acls/acl");
class OrganizerRoutes {
    constructor() {
        this._router = express_1.default.Router();
    }
    build() {
        this._assignRoute();
        return this._router;
    }
    _assignRoute() {
        this._router.route('/').get(acl_1.authorizeForOrganize, (0, helpers_1.checkParametersAndCallRoute)(organizer_controller_1.OrganizerController.getOrganizer));
        this._router.route('/').put(acl_1.authorizeForOrganize, (0, helpers_1.checkParametersAndCallRoute)(organizer_controller_1.OrganizerController.updateOrganizer));
        this._router.route('/login').put((0, helpers_1.checkParametersAndCallRoute)(organizer_controller_1.OrganizerController.subscribe));
        this._router.route('/login').post((0, helpers_1.checkParametersAndCallRoute)(organizer_controller_1.OrganizerController.login));
        this._router.route('/party').post(acl_1.authorizeForOrganize, (0, helpers_1.checkParametersAndCallRoute)(organizer_controller_1.OrganizerController.createNewparty));
        this._router.route('/party').get(acl_1.authorizeForOrganize, (0, helpers_1.checkParametersAndCallRoute)(organizer_controller_1.OrganizerController.getOrganizerParties));
        this._router.route('/party').delete(acl_1.authorizeForOrganize, (0, helpers_1.checkParametersAndCallRoute)(organizer_controller_1.OrganizerController.deleteParty));
    }
}
exports.default = new OrganizerRoutes().build();
//# sourceMappingURL=organizer.route.js.map