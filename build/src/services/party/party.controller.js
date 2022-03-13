"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyController = void 0;
const tslib_1 = require("tslib");
const joi_1 = (0, tslib_1.__importDefault)(require("joi"));
const helpers_1 = require("helpers/helpers");
const orms_1 = require("orms");
const http_status_1 = (0, tslib_1.__importDefault)(require("http-status"));
const user_service_1 = require("services/user/user.service");
require("dotenv/config");
;
class PartyController {
    static getPartiesThatUserCanGoTo(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield orms_1.User.findOne({ where: { id: req.user.id } });
            if (!user) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'User does not exist' });
            }
            const normalizedParties = yield user_service_1.UserService.getPartiesUserCanGoTo(user);
            return res.json({ parties: normalizedParties });
        });
    }
}
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({}))
], PartyController, "getPartiesThatUserCanGoTo", null);
exports.PartyController = PartyController;
//# sourceMappingURL=party.controller.js.map