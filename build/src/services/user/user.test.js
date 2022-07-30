"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const supertest_1 = (0, tslib_1.__importDefault)(require("supertest"));
const index_1 = (0, tslib_1.__importDefault)(require("index"));
const http_status_1 = (0, tslib_1.__importDefault)(require("http-status"));
const orms_1 = require("orms");
const fake_1 = require("helpers/fake");
const pepperDb_1 = require("orms/pepperDb");
const jsonwebtoken_1 = (0, tslib_1.__importDefault)(require("jsonwebtoken"));
const types_1 = require("models/types");
const lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
const user_helper_1 = require("services/user/user.helper");
require("dotenv/config");
describe('## User', () => {
    let user1;
    let user2;
    let user3;
    let user4;
    let user5;
    let user6;
    let user7;
    let party;
    let party2;
    let party3;
    beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield (0, pepperDb_1.syncDbModels)();
        user1 = yield (0, fake_1.createFakeUser)({ gender: types_1.Gender.MAN });
        user2 = yield (0, fake_1.createFakeUser)({ gender: types_1.Gender.MAN });
        user3 = yield (0, fake_1.createFakeUser)({ gender: types_1.Gender.WOMAN });
        user4 = yield (0, fake_1.createFakeUser)({ gender: types_1.Gender.WOMAN });
        user5 = yield (0, fake_1.createFakeUser)({ gender: types_1.Gender.WOMAN });
        user6 = yield (0, fake_1.createFakeUser)({ gender: types_1.Gender.MAN });
        user7 = yield (0, fake_1.createFakeUser)({ gender: types_1.Gender.MAN });
        party = yield (0, fake_1.createFakePartyWithItsOrganizer)();
        party2 = yield (0, fake_1.createFakePartyWithItsOrganizer)();
        party3 = yield (0, fake_1.createFakePartyWithItsOrganizer)();
    }));
    describe('# Login', () => {
        test('should NOT be able to login if phoneNumber is not provided', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(index_1.default).post('/api/user/login').send({ randomField: 'random' }).expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should NOT be able to login if phoneNumber does not exist', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(index_1.default).post('/api/user/login').send({ phoneNumber: '0000000000', code: '123456' }).expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should be able to see if user with phoneNumber does NOT exists if he actually does NOT exist', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const { userExists } = (yield (0, supertest_1.default)(index_1.default).get('/api/user/login').query({ phoneNumber: '0000000000' }).expect(http_status_1.default.OK)).body;
            expect(userExists).toBe(false);
        }));
        test('should be able to see if user with phoneNumber exists if he actually does exist', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const { userExists } = (yield (0, supertest_1.default)(index_1.default).get('/api/user/login').query({ phoneNumber: user1.phoneNumber }).expect(http_status_1.default.OK)).body;
            expect(userExists).toBe(true);
        }));
        test('should be able to subscribe with phoneNumber', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const userInfo = {
                name: fake_1.fake.first_name,
                gender: fake_1.fake.gender,
                phoneNumber: '0000000000',
                address: fake_1.fake.address,
                description: fake_1.fake.description,
                job: fake_1.fake.company_name,
                imgs: [fake_1.fake.portrait, fake_1.fake.portrait, fake_1.fake.portrait],
                interests: [fake_1.fake.word, fake_1.fake.word, fake_1.fake.word],
            };
            const { token } = (yield (0, supertest_1.default)(index_1.default).put('/api/user/login').send(Object.assign(Object.assign({}, userInfo), { code: '123456' })).expect(http_status_1.default.OK)).body;
            const subscribedUser = yield orms_1.User.findOne({ where: { phoneNumber: '0000000000' } });
            if (!process.env.JWT_KEY) {
                throw 'JWT key not provided';
            }
            const authentifiedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            expect(subscribedUser.id).toEqual(authentifiedUser.id);
        }));
        test('should be able to login if phoneNumber exists', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const { token } = (yield (0, supertest_1.default)(index_1.default).post('/api/user/login').send({ phoneNumber: user1.phoneNumber, code: '123456' }).expect(http_status_1.default.OK)).body;
            if (!process.env.JWT_KEY) {
                throw 'JWT key not provided';
            }
            const authentifiedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            expect(user1.id).toEqual(authentifiedUser.id);
        }));
    });
    describe('# Query user data', () => {
        let tokenOfUser1;
        let tokenOfUser2;
        let tokenOfUser3;
        let tokenOfUser4;
        let tokenOfUser5;
        let tokenOfUser6;
        let tokenOfUser7;
        beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const user1Login = (yield (0, supertest_1.default)(index_1.default).post('/api/user/login').send({ phoneNumber: user1.phoneNumber, code: '123456' }).expect(http_status_1.default.OK)).body;
            const user2Login = (yield (0, supertest_1.default)(index_1.default).post('/api/user/login').send({ phoneNumber: user2.phoneNumber, code: '123456' }).expect(http_status_1.default.OK)).body;
            const user3Login = (yield (0, supertest_1.default)(index_1.default).post('/api/user/login').send({ phoneNumber: user3.phoneNumber, code: '123456' }).expect(http_status_1.default.OK)).body;
            const user4Login = (yield (0, supertest_1.default)(index_1.default).post('/api/user/login').send({ phoneNumber: user4.phoneNumber, code: '123456' }).expect(http_status_1.default.OK)).body;
            const user5Login = (yield (0, supertest_1.default)(index_1.default).post('/api/user/login').send({ phoneNumber: user5.phoneNumber, code: '123456' }).expect(http_status_1.default.OK)).body;
            const user6Login = (yield (0, supertest_1.default)(index_1.default).post('/api/user/login').send({ phoneNumber: user6.phoneNumber, code: '123456' }).expect(http_status_1.default.OK)).body;
            const user7Login = (yield (0, supertest_1.default)(index_1.default).post('/api/user/login').send({ phoneNumber: user7.phoneNumber, code: '123456' }).expect(http_status_1.default.OK)).body;
            tokenOfUser1 = user1Login.token;
            tokenOfUser2 = user2Login.token;
            tokenOfUser3 = user3Login.token;
            tokenOfUser4 = user4Login.token;
            tokenOfUser5 = user5Login.token;
            tokenOfUser6 = user6Login.token;
            tokenOfUser7 = user7Login.token;
        }));
        test('should be able to query info with the right token', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const { user } = (yield (0, supertest_1.default)(index_1.default).get(`/api/user/`).
                set('Authorization', tokenOfUser1).
                expect(http_status_1.default.OK)).body;
            expect(user1.id).toEqual(user.id);
        }));
        test('should be able to update user', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const newInfo = { address: 'newAddress', job: 'newJob', description: 'newDescription' };
            const { user } = (yield (0, supertest_1.default)(index_1.default).put(`/api/user/`).
                send(newInfo).
                set('Authorization', tokenOfUser3).
                expect(http_status_1.default.OK)).body;
            expect({
                address: user.address,
                job: user.job,
                description: user.description,
            }).toEqual(newInfo);
        }));
        test('should NOT be able to query info with the wrong token', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(index_1.default).get(`/api/user/`).
                set('Authorization', 'wrongToken').
                expect(http_status_1.default.UNAUTHORIZED);
        }));
        describe('# User Matches', () => {
            let matches;
            beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
                matches = (yield (0, supertest_1.default)(index_1.default).post(`/api/user/matches`).
                    set('Authorization', tokenOfUser1).
                    send({ matchId: user2.id }).
                    expect(http_status_1.default.OK)).body.matches;
            }));
            test('Query should return the list of matches', () => expect(matches).toEqual(expect.arrayContaining([Object.assign(Object.assign({}, lodash_1.default.omit(user2, ['createdAt', 'deletedAt', 'updatedAt'])), { status: types_1.MatchStatus.WAITING })])));
            test('Should be Able to get matches of user', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
                const returnMatches = (yield (0, supertest_1.default)(index_1.default).get(`/api/user/matches`).
                    set('Authorization', tokenOfUser1).
                    expect(http_status_1.default.OK)).body.matches;
                expect(returnMatches).toEqual(expect.arrayContaining([Object.assign(Object.assign({}, lodash_1.default.omit(user2, ['createdAt', 'deletedAt', 'updatedAt'])), { status: types_1.MatchStatus.WAITING })]));
            }));
            test('should find the new match in the user matches list', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
                const userAfterMatch = yield orms_1.User.findOne({ where: { id: user1.id } });
                const userMatches = yield (userAfterMatch === null || userAfterMatch === void 0 ? void 0 : userAfterMatch.getMatches({ raw: true }));
                const normalizedMatches = (0, user_helper_1.normalizeUserMatches)(userMatches || []);
                expect(normalizedMatches).toEqual(expect.arrayContaining([Object.assign(Object.assign({}, lodash_1.default.omit(user2, ['createdAt', 'deletedAt', 'updatedAt'])), { status: types_1.MatchStatus.WAITING })]));
            }));
            test('Should be able to delete a match and they should be deleted for the other user too', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
                const matchesAfterDeletion = (yield (0, supertest_1.default)(index_1.default).delete(`/api/user/matches`).
                    set('Authorization', tokenOfUser1).
                    send({ matchId: user2.id }).
                    expect(http_status_1.default.OK)).body.matches;
                expect(matchesAfterDeletion).toEqual(expect.arrayContaining([]));
                const user1AfterDeletion = yield orms_1.User.findOne({ where: { id: user1.id } });
                const matchesOfUser1AfterDeletion = yield (user1AfterDeletion === null || user1AfterDeletion === void 0 ? void 0 : user1AfterDeletion.getMatches({ raw: true }));
                const normalizedMatchesOfUser1 = (0, user_helper_1.normalizeUserMatches)(matchesOfUser1AfterDeletion || []);
                expect(normalizedMatchesOfUser1).toEqual(expect.arrayContaining([]));
                const user2AfterDeletion = yield orms_1.User.findOne({ where: { id: user1.id } });
                const matchesOfUser2AfterDeletion = yield (user2AfterDeletion === null || user2AfterDeletion === void 0 ? void 0 : user2AfterDeletion.getMatches({ raw: true }));
                const normalizedMatchesOfUser2 = (0, user_helper_1.normalizeUserMatches)(matchesOfUser2AfterDeletion || []);
                expect(normalizedMatchesOfUser2).toEqual(expect.arrayContaining([]));
            }));
        });
        describe('# User Parties', () => {
            test('Should be Able to add party to user and return them', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
                const parties = (yield (0, supertest_1.default)(index_1.default).post(`/api/user/parties`).
                    set('Authorization', tokenOfUser1).
                    send({ partyId: party.id }).
                    expect(http_status_1.default.OK)).body.parties;
                expect(parties.map((currentParty) => currentParty.id)).toEqual([party.id]);
                const userAfterAddingParty = yield orms_1.User.findOne({ where: { id: user1.id } });
                const AfterAddingParty = yield (userAfterAddingParty === null || userAfterAddingParty === void 0 ? void 0 : userAfterAddingParty.getParties({ raw: true }));
                expect(AfterAddingParty === null || AfterAddingParty === void 0 ? void 0 : AfterAddingParty.map((currentParty) => currentParty.id)).toEqual([party.id]);
            }));
            test('Should be Able to get parties of user', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
                const parties = (yield (0, supertest_1.default)(index_1.default).get(`/api/user/parties`).
                    set('Authorization', tokenOfUser1).
                    expect(http_status_1.default.OK)).body.parties;
                expect(parties.map((currentParty) => currentParty.id)).toEqual([party.id]);
                const userAfterAddingParty = yield orms_1.User.findOne({ where: { id: user1.id } });
                const AfterAddingParty = yield (userAfterAddingParty === null || userAfterAddingParty === void 0 ? void 0 : userAfterAddingParty.getParties({ raw: true }));
                expect(AfterAddingParty === null || AfterAddingParty === void 0 ? void 0 : AfterAddingParty.map((currentParty) => currentParty.id)).toEqual([party.id]);
            }));
            test('Should be Able to cancel user\'s party and return them', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
                const parties = (yield (0, supertest_1.default)(index_1.default).delete(`/api/user/parties`).
                    set('Authorization', tokenOfUser1).
                    send({ partyId: party.id }).
                    expect(http_status_1.default.OK)).body.parties;
                expect(parties.map((currentParty) => currentParty.id)).toEqual([]);
                const userAfterAddingParty = yield orms_1.User.findOne({ where: { id: user1.id } });
                const AfterAddingParty = yield (userAfterAddingParty === null || userAfterAddingParty === void 0 ? void 0 : userAfterAddingParty.getParties({ raw: true }));
                expect(AfterAddingParty === null || AfterAddingParty === void 0 ? void 0 : AfterAddingParty.map((currentParty) => currentParty.id)).toEqual([]);
            }));
            test('Should maintain gender parity and get parties for user', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
                var _a;
                yield (0, supertest_1.default)(index_1.default).post(`/api/user/parties`).
                    set('Authorization', tokenOfUser1).
                    send({ partyId: party3.id }).
                    expect(http_status_1.default.OK);
                yield (0, supertest_1.default)(index_1.default).post(`/api/user/parties`).
                    set('Authorization', tokenOfUser2).
                    send({ partyId: party3.id }).
                    expect(http_status_1.default.OK);
                let genderParityParties = (yield (0, supertest_1.default)(index_1.default).get(`/api/user/parties`).
                    set('Authorization', tokenOfUser1).
                    expect(http_status_1.default.OK)).body.parties.filter((party) => party.id === party3.id)[0];
                console.log('genderParityParties', genderParityParties);
                expect(lodash_1.default.sortBy((_a = genderParityParties.attendees) === null || _a === void 0 ? void 0 : _a.map((attendee) => attendee.id))).toEqual([user1.id]);
                yield (0, supertest_1.default)(index_1.default).post(`/api/user/parties`).
                    set('Authorization', tokenOfUser3).
                    send({ partyId: party3.id }).
                    expect(http_status_1.default.OK);
                genderParityParties = (yield (0, supertest_1.default)(index_1.default).get(`/api/user/parties`).
                    set('Authorization', tokenOfUser1).
                    expect(http_status_1.default.OK)).body.parties.filter((party) => party.id === party3.id)[0];
                ;
                expect(lodash_1.default.sortBy(genderParityParties.attendees.map((attendee) => attendee.id))).toEqual([user1.id, user2.id, user3.id]);
                yield (0, supertest_1.default)(index_1.default).post(`/api/user/parties`).
                    set('Authorization', tokenOfUser4).
                    send({ partyId: party3.id }).
                    expect(http_status_1.default.OK);
                genderParityParties = (yield (0, supertest_1.default)(index_1.default).get(`/api/user/parties`).
                    set('Authorization', tokenOfUser1).
                    expect(http_status_1.default.OK)).body.parties.filter((party) => party.id === party3.id)[0];
                ;
                expect(lodash_1.default.sortBy(genderParityParties.attendees.map((attendee) => attendee.id))).toEqual([user1.id, user2.id, user3.id, user4.id]);
                yield (0, supertest_1.default)(index_1.default).post(`/api/user/parties`).
                    set('Authorization', tokenOfUser5).
                    send({ partyId: party3.id }).
                    expect(http_status_1.default.OK);
                genderParityParties = (yield (0, supertest_1.default)(index_1.default).get(`/api/user/parties`).
                    set('Authorization', tokenOfUser1).
                    expect(http_status_1.default.OK)).body.parties.filter((party) => party.id === party3.id)[0];
                ;
                expect(lodash_1.default.sortBy(genderParityParties.attendees.map((attendee) => attendee.id))).toEqual([user1.id, user2.id, user3.id, user4.id]);
                yield (0, supertest_1.default)(index_1.default).post(`/api/user/parties`).
                    set('Authorization', tokenOfUser6).
                    send({ partyId: party3.id }).
                    expect(http_status_1.default.OK);
                genderParityParties = (yield (0, supertest_1.default)(index_1.default).get(`/api/user/parties`).
                    set('Authorization', tokenOfUser1).
                    expect(http_status_1.default.OK)).body.parties.filter((party) => party.id === party3.id)[0];
                ;
                expect(lodash_1.default.sortBy(genderParityParties.attendees.map((attendee) => attendee.id))).toEqual([user1.id, user2.id, user3.id, user4.id, user5.id, user6.id]);
            }));
            test('Should NOT be able to attend party using organizerId if user has not been accepted', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
                const organizer = yield party2.getOrganizer();
                yield (0, supertest_1.default)(index_1.default).put(`/api/user/parties`).
                    set('Authorization', tokenOfUser7).
                    send({ organizerId: organizer.id }).
                    expect(http_status_1.default.UNAUTHORIZED);
            }));
            test('Should be able to attend party using organizerId', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(index_1.default).post(`/api/user/parties`).
                    set('Authorization', tokenOfUser7).
                    send({ partyId: party2.id }).
                    expect(http_status_1.default.OK);
                const organizer = yield party2.getOrganizer();
                const parties = yield (0, supertest_1.default)(index_1.default).put(`/api/user/parties`).
                    set('Authorization', tokenOfUser7).
                    send({ organizerId: organizer.id }).
                    expect(http_status_1.default.OK);
                expect(parties.body.parties.map((currentParty) => currentParty.id)).toEqual([party2.id]);
            }));
        });
    });
});
//# sourceMappingURL=user.test.js.map