"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fake = exports.createFakeParty = exports.createFakeOrganizer = exports.createFakeUser = exports.createFakePartyWithItsOrganizer = void 0;
const tslib_1 = require("tslib");
const orms_1 = require("orms");
const types_1 = require("models/types");
const casual_1 = (0, tslib_1.__importDefault)(require("casual"));
exports.fake = casual_1.default;
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
casual_1.default.define('portrait', () => ({ uri: `https://source.unsplash.com/collection/9948714?${casual_1.default.integer(1, 100)}` }));
casual_1.default.define('bar', () => ({ uri: `https://source.unsplash.com/collection/3639161?${casual_1.default.integer(1, 20)}` }));
casual_1.default.define('gender', () => casual_1.default.boolean ? types_1.Gender.MAN : types_1.Gender.WOMAN);
casual_1.default.define('phoneNumber', () => casual_1.default.numerify('06########'));
casual_1.default.define('product', () => ({ name: casual_1.default.word, price: casual_1.default.integer(3, 20) }));
casual_1.default.define('match_status', () => [
    types_1.MatchStatus.ACCEPTED,
    types_1.MatchStatus.WAITING,
][casual_1.default.integer(0, 1)]);
const createFakeUser = (overrideProps) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const user = yield orms_1.User.create(Object.assign({ name: casual_1.default.first_name, gender: casual_1.default.gender, phoneNumber: casual_1.default.phoneNumber, address: casual_1.default.address, description: casual_1.default.description, job: casual_1.default.company_name, imgs: [casual_1.default.portrait, casual_1.default.portrait, casual_1.default.portrait], interests: [casual_1.default.word, casual_1.default.word, casual_1.default.word], facebook: casual_1.default.name, instagram: casual_1.default.name, snapchat: casual_1.default.name }, (overrideProps ? overrideProps : {})));
    return user.get({ plain: true });
});
exports.createFakeUser = createFakeUser;
const createFakeOrganizer = (password = casual_1.default.password) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const organizer = yield orms_1.Organizer.create({
        phoneNumber: casual_1.default.phoneNumber,
        userName: casual_1.default.username,
        password: password,
        title: casual_1.default.title,
        location: casual_1.default.address,
        description: casual_1.default.description,
        imgs: [casual_1.default.portrait, casual_1.default.portrait, casual_1.default.portrait],
        foods: [casual_1.default.product, casual_1.default.product, casual_1.default.product],
        drinks: [casual_1.default.product, casual_1.default.product, casual_1.default.product],
        status: types_1.OrganizerStatus.Pending
    });
    return organizer.get({ plain: true });
});
exports.createFakeOrganizer = createFakeOrganizer;
const createFakePartyWithItsOrganizer = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const organizer = yield orms_1.Organizer.create({
        phoneNumber: casual_1.default.phoneNumber,
        userName: casual_1.default.username,
        password: casual_1.default.password,
        title: casual_1.default.title,
        location: casual_1.default.address,
        description: casual_1.default.description,
        imgs: [casual_1.default.bar, casual_1.default.bar, casual_1.default.bar],
        foods: [casual_1.default.product, casual_1.default.product, casual_1.default.product],
        drinks: [casual_1.default.product, casual_1.default.product, casual_1.default.product],
        status: types_1.OrganizerStatus.Accepted
    });
    const party = yield orms_1.Party.create({
        theme: casual_1.default.title,
        date: (0, moment_1.default)(),
        price: casual_1.default.integer(0, 100),
        people: casual_1.default.integer(20, 40),
        minAge: casual_1.default.integer(18, 21),
        maxAge: casual_1.default.integer(28, 30),
    });
    yield organizer.addParty(party);
    const createdParty = yield orms_1.Party.findOne({ where: { id: party.id }, raw: false });
    if (!createdParty) {
        throw 'Fake party creation failed';
    }
    return createdParty;
});
exports.createFakePartyWithItsOrganizer = createFakePartyWithItsOrganizer;
const createFakeParty = (organizerInfo) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const organizer = yield orms_1.Organizer.findOne({ where: { id: organizerInfo.id }, raw: false });
    const party = yield orms_1.Party.create({
        theme: casual_1.default.title,
        date: (0, moment_1.default)(),
        price: casual_1.default.integer(0, 100),
        people: casual_1.default.integer(20, 40),
        minAge: casual_1.default.integer(18, 21),
        maxAge: casual_1.default.integer(28, 30),
    });
    yield (organizer === null || organizer === void 0 ? void 0 : organizer.addParty(party));
    const createdParty = yield orms_1.Party.findOne({ where: { id: party.id }, raw: false });
    if (!createdParty) {
        throw 'Fake party creation failed';
    }
    return createdParty;
});
exports.createFakeParty = createFakeParty;
//# sourceMappingURL=fake.js.map