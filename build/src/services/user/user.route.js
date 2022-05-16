"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const user_controller_1 = require("services/user/user.controller");
const helpers_1 = require("helpers/helpers");
const acl_1 = require("acls/acl");
class UserRoutes {
    constructor() {
        this._router = express_1.default.Router();
    }
    build() {
        this._assignRoute();
        return this._router;
    }
    _assignRoute() {
        this._router.route('/').get(acl_1.authorizeForUser, (0, helpers_1.checkParametersAndCallRoute)(user_controller_1.UserController.getUser));
        this._router.route('/').put(acl_1.authorizeForUser, (0, helpers_1.checkParametersAndCallRoute)(user_controller_1.UserController.updateUser));
        this._router.route('/login').get((0, helpers_1.checkParametersAndCallRoute)(user_controller_1.UserController.createLoginVerificationAndCheckIfUserExisits));
        this._router.route('/login').put((0, helpers_1.checkParametersAndCallRoute)(user_controller_1.UserController.subscribe));
        this._router.route('/login').post((0, helpers_1.checkParametersAndCallRoute)(user_controller_1.UserController.login));
        this._router.route('/matches').get(acl_1.authorizeForUser, (0, helpers_1.checkParametersAndCallRoute)(user_controller_1.UserController.getMatches));
        this._router.route('/matches').post(acl_1.authorizeForUser, (0, helpers_1.checkParametersAndCallRoute)(user_controller_1.UserController.addMatch));
        this._router.route('/matches').delete(acl_1.authorizeForUser, (0, helpers_1.checkParametersAndCallRoute)(user_controller_1.UserController.deleteMatch));
        this._router.route('/parties').get(acl_1.authorizeForUser, (0, helpers_1.checkParametersAndCallRoute)(user_controller_1.UserController.getParties));
        this._router.route('/parties').post(acl_1.authorizeForUser, (0, helpers_1.checkParametersAndCallRoute)(user_controller_1.UserController.addParty));
        this._router.route('/parties').put(acl_1.authorizeForUser, (0, helpers_1.checkParametersAndCallRoute)(user_controller_1.UserController.attendParty));
        this._router.route('/parties').delete(acl_1.authorizeForUser, (0, helpers_1.checkParametersAndCallRoute)(user_controller_1.UserController.cancelParty));
    }
}
exports.default = new UserRoutes().build();
//# sourceMappingURL=user.route.js.map