"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizerService = void 0;
const tslib_1 = require("tslib");
const user_helper_1 = require("services/user/user.helper");
class OrganizerService {
    static getOrganizerParties(organizer) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const parties = yield organizer.getParties({ order: [['createdAt', 'DESC']] });
            const partiesWithOrganizers = parties.map((currentParty) => {
                return Object.assign(Object.assign({}, organizer.get({ plain: true })), currentParty.get({ plain: true }));
            });
            const normalizedParties = (0, user_helper_1.normalizeParties)(partiesWithOrganizers);
            return normalizedParties;
        });
    }
}
exports.OrganizerService = OrganizerService;
//# sourceMappingURL=organizer.service.js.map