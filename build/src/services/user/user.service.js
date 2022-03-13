"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tslib_1 = require("tslib");
const orms_1 = require("orms");
const user_helper_1 = require("services/user/user.helper");
const types_1 = require("models/types");
const sequelize_1 = require("sequelize");
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
class UserService {
    static getUserParties(user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const parties = yield user.getParties();
            const partiesWithOrganizers = yield Promise.all(yield parties.map((currentParty) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                const organizer = yield currentParty.getOrganizer();
                return Object.assign(Object.assign({}, organizer.get({ plain: true })), currentParty.get({ plain: true }));
            })));
            const normalizedParties = (0, user_helper_1.normalizeParties)(partiesWithOrganizers);
            return normalizedParties;
        });
    }
    static getPartiesUserCanGoTo(user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const userParties = yield user.getParties();
            const parties = yield orms_1.Party.findAll({ where: {
                    id: {
                        [sequelize_1.Op.notIn]: userParties.map((userParty) => userParty.id),
                    }
                }
            });
            const partiesWithOrganizers = yield Promise.all(yield parties.map((currentParty) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                const organizer = yield currentParty.getOrganizer();
                return Object.assign(Object.assign({}, organizer.get({ plain: true })), currentParty.get({ plain: true }));
            })));
            const normalizedParties = (0, user_helper_1.normalizeParties)(partiesWithOrganizers);
            return normalizedParties;
        });
    }
    static getUserMatches(user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const matches = yield user.getMatches({ raw: true });
            const normalizedMatches = (0, user_helper_1.normalizeUserMatches)(matches);
            return normalizedMatches;
        });
    }
    static updateUserMatchStatus(user, match, status) {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const userMatchStatus = (_a = (yield orms_1.UserMatch.findOne({ where: { UserId: user.id } }))) === null || _a === void 0 ? void 0 : _a.status;
            const matchUserStatus = (_b = (yield orms_1.UserMatch.findOne({ where: { UserId: match.id } }))) === null || _b === void 0 ? void 0 : _b.status;
            if (!userMatchStatus || !matchUserStatus) {
                throw 'Match and User are not actually matched';
            }
            if (status === types_1.MatchStatus.WAITING && matchUserStatus === types_1.MatchStatus.WAITING) {
                yield orms_1.UserMatch.update({ status: types_1.MatchStatus.ACCEPTED }, { where: { [sequelize_1.Op.and]: [{ UserId: user.id }, { MatchId: match.id }] } });
                yield orms_1.UserMatch.update({ status: types_1.MatchStatus.ACCEPTED }, { where: { [sequelize_1.Op.and]: [{ UserId: match.id }, { MatchId: user.id }] } });
                return null;
            }
            yield orms_1.UserMatch.update({ status }, { where: { [sequelize_1.Op.and]: [{ UserId: user.id }, { MatchId: match.id }] } });
        });
    }
    static updateAllUnavailableFromYesterdayToUnchecked() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const todayFirstHour = (0, moment_1.default)().startOf('day').add(6, 'hours').toDate();
            yield orms_1.UserMatch.update({ status: types_1.MatchStatus.UNCHECKED }, { where: {
                    [sequelize_1.Op.and]: [
                        { status: types_1.MatchStatus.UNAVAILABLE },
                        { createdAt: { [sequelize_1.Op.lt]: todayFirstHour } }
                    ],
                },
            });
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map