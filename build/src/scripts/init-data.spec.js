"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const casual_1 = (0, tslib_1.__importDefault)(require("casual"));
const orms_1 = require("orms");
const pepperDb_1 = require("orms/pepperDb");
const fake_1 = require("helpers/fake");
const numberOfUsersToAdd = 50;
const numberOfOrganizersToAdd = 3;
describe('## Init Data', () => {
    let users;
    let organizers;
    beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield (0, pepperDb_1.syncDbModels)();
    }));
    test('Add Users', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const fakeUsersData = yield Promise.all([...Array(numberOfUsersToAdd).keys()].map(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () { return (0, fake_1.createFakeUser)(); })));
        users = yield orms_1.User.findAll();
        expect(fakeUsersData).toBeTruthy();
    }));
    test('Match Users', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const maxNumberOfMatches = 5;
        const minNumberOfMatches = 0;
        yield Promise.all(users.map((user, key) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            var e_1, _a;
            const numberOfMatches = fake_1.fake.integer(minNumberOfMatches, maxNumberOfMatches);
            try {
                for (var _b = (0, tslib_1.__asyncValues)([...Array(numberOfMatches).keys()]), _c; _c = yield _b.next(), !_c.done;) {
                    let i = _c.value;
                    const matchKey = fake_1.fake.integer(i, numberOfUsersToAdd - 1);
                    if (matchKey === key) {
                        return;
                    }
                    try {
                        const status = casual_1.default.match_status;
                        yield user.addMatch(users[matchKey], { through: { status } });
                        yield users[matchKey].addMatch(user, { through: { status } });
                    }
                    catch (e) { }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        })));
    }));
    test('Add Organizers', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const fakeOrganizersData = [...Array(numberOfOrganizersToAdd).keys()].map(() => ({
            title: fake_1.fake.title,
            location: fake_1.fake.address,
            description: fake_1.fake.description,
            imgs: [casual_1.default.img, casual_1.default.img, casual_1.default.img],
            price: fake_1.fake.integer(0, 100),
            foods: [fake_1.fake.word, fake_1.fake.word, fake_1.fake.word],
            drinks: [fake_1.fake.word, fake_1.fake.word, fake_1.fake.word],
        }));
        organizers = yield Promise.all(fakeOrganizersData.map((organizerData) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const createdUser = yield orms_1.Organizer.create(organizerData);
            return createdUser;
        })));
        expect(organizers).toBeTruthy();
    }));
    test('Add Parties to organizers', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const maxNumberOfParties = 5;
        const minNumberOfParties = 0;
        yield Promise.all(organizers.map((organizer) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            var e_2, _d;
            const numberOfParties = fake_1.fake.integer(minNumberOfParties, maxNumberOfParties);
            try {
                for (var _e = (0, tslib_1.__asyncValues)([...Array(numberOfParties).keys()]), _f; _f = yield _e.next(), !_f.done;) {
                    let i = _f.value;
                    const party = yield orms_1.Party.create({
                        theme: fake_1.fake.title,
                        date: new Date(fake_1.fake.date('YYYY-MM-DD')),
                        people: fake_1.fake.integer(20, 40),
                        minAge: 18,
                        maxAge: 25 + i,
                    });
                    yield organizer.addParty(party);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_d = _e.return)) yield _d.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
        })));
    }));
    test('Add Parties to Users', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const parties = yield orms_1.Party.findAll();
        yield Promise.all(parties.map((party) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            var e_3, _g;
            try {
                for (var _h = (0, tslib_1.__asyncValues)([...Array(party.people).keys()]), _j; _j = yield _h.next(), !_j.done;) {
                    let i = _j.value;
                    const userIndex = fake_1.fake.integer(i, numberOfUsersToAdd - 1);
                    ;
                    yield users[userIndex].addParty(party);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_g = _h.return)) yield _g.call(_h);
                }
                finally { if (e_3) throw e_3.error; }
            }
        })));
    }));
});
//# sourceMappingURL=init-data.spec.js.map