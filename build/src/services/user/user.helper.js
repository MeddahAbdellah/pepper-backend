"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOrganizerParties = exports.normalizeUserMatches = void 0;
const tslib_1 = require("tslib");
const lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
const normalizeUserMatches = (userMatches) => {
    return userMatches.map((match) => ({
        id: match.id,
        name: match.name,
        gender: match.gender,
        phoneNumber: match.phoneNumber,
        address: match.address,
        description: match.description,
        job: match.job,
        imgs: match.imgs,
        interests: match.interests,
        status: match['UserMatch.status'],
    }));
};
exports.normalizeUserMatches = normalizeUserMatches;
const normalizeOrganizerParties = (userParties) => {
    const normalizedOrganizerParty = lodash_1.default.map(userParties, (party) => {
        return lodash_1.default.omit(party, ['UserParties', 'createdAt', 'updatedAt', 'deletedAt']);
    });
    return normalizedOrganizerParty;
};
exports.normalizeOrganizerParties = normalizeOrganizerParties;
//# sourceMappingURL=user.helper.js.map