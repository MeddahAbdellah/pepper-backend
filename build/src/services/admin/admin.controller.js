"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const tslib_1 = require("tslib");
const joi_1 = (0, tslib_1.__importDefault)(require("joi"));
const helpers_1 = require("helpers/helpers");
const orms_1 = require("orms");
const types_1 = require("models/types");
require("dotenv/config");
const lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
class AdminController {
    static updateStatus(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield orms_1.Organizer.update({ status: req.body.status }, { where: { id: req.body.id } });
            const organizer = yield orms_1.Organizer.findOne({ where: { id: req.body.id }, raw: true });
            return res.json({ organizer: lodash_1.default.omit(organizer, ['createdAt', 'updatedAt', 'deletedAt', 'password']) });
        });
    }
}
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        id: joi_1.default.number().required(),
        status: joi_1.default.string().valid(types_1.OrganizerStatus.Pending, types_1.OrganizerStatus.Accepted, types_1.OrganizerStatus.Rejected).required(),
    }))
], AdminController, "updateStatus", null);
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map