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
const sha256_1 = (0, tslib_1.__importDefault)(require("crypto-js/sha256"));
const casual_1 = (0, tslib_1.__importDefault)(require("casual"));
describe('## organizer', () => {
    let organizerObject;
    let organizerObject2;
    const organizerPassword = casual_1.default.password;
    let organizerToken;
    beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield (0, pepperDb_1.syncDbModels)();
        organizerObject = yield (0, fake_1.createFakeOrganizer)(organizerPassword);
        organizerObject2 = yield (0, fake_1.createFakeOrganizer)(organizerPassword);
        organizerToken = (yield (0, supertest_1.default)(index_1.default).post('/api/organizer/login').send({ userName: organizerObject2.userName, password: organizerPassword }).expect(http_status_1.default.OK)).body.token;
    }));
    describe('# Login Oganizer', () => {
        test('should NOT be able to login if userName is not provided', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(index_1.default).post('/api/organizer/login').send({ randomField: 'random' }).expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should NOT be able to login if organizer does not exist', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(index_1.default).post('/api/organizer/login').send({ userName: 'Test', password: '123456' }).expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should be able to subscribe with userName and Password', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const organizerInfoTest = {
                userName: fake_1.fake.username,
                phoneNumber: fake_1.fake.phone,
                password: fake_1.fake.password,
                title: fake_1.fake.title,
                location: fake_1.fake.address,
                description: fake_1.fake.description,
                imgs: [fake_1.fake.portrait, fake_1.fake.portrait, fake_1.fake.portrait],
                foods: [fake_1.fake.product, fake_1.fake.product, fake_1.fake.product],
                drinks: [fake_1.fake.product, fake_1.fake.product, fake_1.fake.product],
            };
            const { token } = (yield (0, supertest_1.default)(index_1.default).put('/api/organizer/login').send(Object.assign({}, organizerInfoTest)).expect(http_status_1.default.OK)).body;
            const subscribedOrganizer = yield orms_1.Organizer.findOne({
                where: { userName: organizerInfoTest.userName, password: (0, sha256_1.default)(organizerInfoTest.password).toString() },
                raw: true
            });
            if (!process.env.JWT_KEY) {
                throw 'JWT key not provided';
            }
            const authentifiedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            expect(subscribedOrganizer.id).toEqual(authentifiedUser.id);
        }));
        test('should be able to login with userName and Password', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const { token } = (yield (0, supertest_1.default)(index_1.default).post('/api/organizer/login').send({ userName: organizerObject.userName, password: organizerPassword }).expect(http_status_1.default.OK)).body;
            if (!process.env.JWT_KEY) {
                throw 'JWT key not provided';
            }
            const authentifiedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            expect(organizerObject.id).toEqual(authentifiedUser.id);
        }));
        test('should not able to subscribe with same userName twice', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const organizerInfo2 = {
                userName: fake_1.fake.username,
                phoneNumber: fake_1.fake.phone,
                password: fake_1.fake.password,
                title: fake_1.fake.title,
                location: fake_1.fake.address,
                description: fake_1.fake.description,
                imgs: [fake_1.fake.portrait, fake_1.fake.portrait, fake_1.fake.portrait],
                foods: [fake_1.fake.product, fake_1.fake.product, fake_1.fake.product],
                drinks: [fake_1.fake.product, fake_1.fake.product, fake_1.fake.product],
            };
            yield (0, supertest_1.default)(index_1.default).put('/api/organizer/login').send(Object.assign({}, organizerInfo2)).expect(http_status_1.default.OK);
            yield (0, supertest_1.default)(index_1.default).put('/api/organizer/login').send(Object.assign({}, organizerInfo2)).expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should be able to query info with the right token', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const { token } = (yield (0, supertest_1.default)(index_1.default).post('/api/organizer/login').send({ userName: organizerObject.userName, password: organizerPassword }).expect(http_status_1.default.OK)).body;
            const organizer1 = (yield (0, supertest_1.default)(index_1.default).get(`/api/organizer/`).
                set('Authorization', token).
                expect(http_status_1.default.OK)).body.organizer;
            expect(organizer1.id).toEqual(organizerObject.id);
        }));
        test('should NOT be able to query info with the wrong token', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(index_1.default).get(`/api/organizer/`).
                set('Authorization', 'wrongToken').
                expect(http_status_1.default.UNAUTHORIZED);
        }));
    });
    describe('# Update Oganizer', () => {
        test('should be able to update organizer', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const newInfo = {
                title: fake_1.fake.title,
                location: fake_1.fake.address,
                description: fake_1.fake.description,
            };
            const { token } = (yield (0, supertest_1.default)(index_1.default).post('/api/organizer/login').send({ userName: organizerObject.userName, password: organizerPassword }).expect(http_status_1.default.OK)).body;
            const { organizer } = (yield (0, supertest_1.default)(index_1.default).put(`/api/organizer/`).
                send(newInfo).
                set('Authorization', token).
                expect(http_status_1.default.OK)).body;
            expect({
                title: organizer.title,
                location: organizer.location,
                description: organizer.description,
            }).toEqual(newInfo);
        }));
    });
    describe('# organizer parties', () => {
        test('Should be able to get organizer own parties', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const organizerTest = yield (0, fake_1.createFakeOrganizer)(organizerPassword);
            const p1 = yield (0, fake_1.createFakeParty)(organizerTest);
            const p2 = yield (0, fake_1.createFakeParty)(organizerTest);
            const testToken = (yield (0, supertest_1.default)(index_1.default).post('/api/organizer/login').
                send({ userName: organizerTest.userName, password: organizerPassword }).expect(http_status_1.default.OK)).body.token;
            const parties = (yield (0, supertest_1.default)(index_1.default).get(`/api/organizer/party`).
                set('Authorization', testToken).
                expect(http_status_1.default.OK)).body.parties;
            expect(parties.length).toEqual(2);
            expect(parties[0].id).toEqual(p2.id);
            expect(parties[1].id).toEqual(p1.id);
        }));
        test('Should be able to create new party for organizer', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const partyTest = {
                theme: casual_1.default.title,
                date: new Date(casual_1.default.date('YYYY-MM-DD')),
                price: casual_1.default.integer(0, 20),
                people: casual_1.default.integer(20, 40),
                minAge: casual_1.default.integer(20, 30),
                maxAge: casual_1.default.integer(30, 50),
            };
            const parties = (yield (0, supertest_1.default)(index_1.default).post(`/api/organizer/party`).
                send(Object.assign({}, partyTest)).
                set('Authorization', organizerToken).
                expect(http_status_1.default.OK)).body.parties;
            expect(parties.length).toEqual(1);
            expect(parties[0].theme).toEqual(partyTest.theme);
            expect(parties[0].price).toEqual(partyTest.price);
        }));
    });
});
//# sourceMappingURL=organizer.test.js.map