"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const orms_1 = require("orms");
const fake_1 = require("helpers/fake");
const pepperDb_1 = require("orms/pepperDb");
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
const user_service_1 = require("services/user/user.service");
const types_1 = require("models/types");
describe('## User', () => {
    let user1;
    let user2;
    beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield (0, pepperDb_1.syncDbModels)();
        user1 = yield (0, fake_1.createFakeUser)();
        user2 = yield (0, fake_1.createFakeUser)();
        const user1Orm = yield orms_1.User.findOne({ where: { id: user1.id } });
        const user2Orm = yield orms_1.User.findOne({ where: { id: user2.id } });
        if (!user2Orm || !user1Orm) {
            return;
        }
        yield (user1Orm === null || user1Orm === void 0 ? void 0 : user1Orm.addMatch(user2Orm));
        yield (user2Orm === null || user2Orm === void 0 ? void 0 : user2Orm.addMatch(user1Orm));
        const yesterday = (0, moment_1.default)().subtract(1, 'days').startOf('day').format("YYYY-MM-DD");
        yield orms_1.UserMatch.update({ createdAt: yesterday }, { where: {} });
    }));
    test('# updateAllUnavailableFromYesterdayToUnchecked should update all unchecked', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield user_service_1.UserService.updateAllUnavailableFromYesterdayToUnchecked();
        const userMatches = yield orms_1.UserMatch.findAll({ where: { status: types_1.MatchStatus.UNCHECKED } });
        expect(userMatches.length).toEqual(2);
    }));
    test('# updateAllUnavailableFromYesterdayToUnchecked should NOT update if NOT unchecked', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield orms_1.UserMatch.update({ status: types_1.MatchStatus.WAITING }, { where: {} });
        yield user_service_1.UserService.updateAllUnavailableFromYesterdayToUnchecked();
        const userMatches = yield orms_1.UserMatch.findAll({ where: { status: types_1.MatchStatus.UNCHECKED } });
        expect(userMatches.length).toEqual(0);
    }));
});
//# sourceMappingURL=user.spec.js.map