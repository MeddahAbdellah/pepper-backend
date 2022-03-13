"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const supertest_1 = (0, tslib_1.__importDefault)(require("supertest"));
const index_1 = (0, tslib_1.__importDefault)(require("index"));
const http_status_1 = (0, tslib_1.__importDefault)(require("http-status"));
const orms_1 = require("orms");
const fake_1 = require("helpers/fake");
const pepperDb_1 = require("orms/pepperDb");
require("dotenv/config");
describe('## Party', () => {
    let user;
    let tokenOfUser1;
    let party1;
    let party2;
    beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        var _a;
        yield (0, pepperDb_1.syncDbModels)();
        user = yield (0, fake_1.createFakeUser)();
        party1 = yield (0, fake_1.createFakePartyWithItsOrganizer)();
        party2 = yield (0, fake_1.createFakePartyWithItsOrganizer)();
        yield ((_a = (yield orms_1.User.findOne({ where: { id: user.id } }))) === null || _a === void 0 ? void 0 : _a.addParty(party1));
        const { token } = (yield (0, supertest_1.default)(index_1.default).post('/api/user/login').send({ phoneNumber: user.phoneNumber, code: '123456' }).expect(http_status_1.default.OK)).body;
        tokenOfUser1 = token;
    }));
    test('Should be able to get party that the user is not going to', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const partiesUserCanGoTo = (yield (0, supertest_1.default)(index_1.default).get(`/api/party`).
            set('Authorization', tokenOfUser1).
            expect(http_status_1.default.OK)).body.parties;
        expect(partiesUserCanGoTo.map((p) => p.id)).toEqual([party2.id]);
    }));
});
//# sourceMappingURL=party.test.js.map