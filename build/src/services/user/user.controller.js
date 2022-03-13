"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tslib_1 = require("tslib");
const joi_1 = (0, tslib_1.__importDefault)(require("joi"));
const helpers_1 = require("helpers/helpers");
const orms_1 = require("orms");
const http_status_1 = (0, tslib_1.__importDefault)(require("http-status"));
const jsonwebtoken_1 = (0, tslib_1.__importDefault)(require("jsonwebtoken"));
const types_1 = require("models/types");
const lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
const user_service_1 = require("services/user/user.service");
require("dotenv/config");
const auth_1 = (0, tslib_1.__importDefault)(require("helpers/auth"));
;
class UserController {
    static createLoginVerificationAndCheckIfUserExisits(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield orms_1.User.findOne({ where: { phoneNumber: req.query.phoneNumber }, raw: true });
            yield auth_1.default.createVerification(req.query.phoneNumber);
            return res.json({ userExists: !!user });
        });
    }
    static subscribe(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const isVerified = yield auth_1.default.checkVerification(req.body.phoneNumber, req.body.code);
            if (!isVerified) {
                res.status(http_status_1.default.UNAUTHORIZED);
                return res.json({ message: 'Verification code not valid' });
            }
            yield orms_1.User.create({
                name: req.body.name,
                gender: req.body.gender,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                description: req.body.description,
                job: req.body.job,
                imgs: req.body.imgs,
                interests: req.body.interests,
            });
            const user = yield orms_1.User.findOne({ where: { phoneNumber: req.body.phoneNumber }, raw: true });
            if (!user) {
                res.status(http_status_1.default.INTERNAL_SERVER_ERROR);
                return res.json({ message: 'User could not be created!' });
            }
            if (!process.env.JWT_KEY) {
                throw 'JWT key not provided';
            }
            const token = jsonwebtoken_1.default.sign(user, process.env.JWT_KEY);
            return res.json({ token });
        });
    }
    static login(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield orms_1.User.findOne({ where: { phoneNumber: req.body.phoneNumber }, raw: true });
            if (!user) {
                res.status(http_status_1.default.UNAUTHORIZED);
                return res.json({ message: 'User does not exist' });
            }
            const isVerified = yield auth_1.default.checkVerification(req.body.phoneNumber, req.body.code);
            if (!isVerified) {
                res.status(http_status_1.default.UNAUTHORIZED);
                return res.json({ message: 'Verification code not valid' });
            }
            if (!process.env.JWT_KEY) {
                throw 'JWT key not provided';
            }
            const token = jsonwebtoken_1.default.sign(user, process.env.JWT_KEY);
            return res.json({ token });
        });
    }
    static getUser(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield orms_1.User.findOne({ where: { id: req.user.id }, raw: true });
            if (!user) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'User does not exist' });
            }
            return res.json({ user: lodash_1.default.omit(user, ['createdAt', 'updatedAt', 'deletedAt']) });
        });
    }
    static updateUser(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield orms_1.User.update(Object.assign({}, req.body), { where: { id: req.user.id } });
            const user = yield orms_1.User.findOne({ where: { id: req.user.id }, raw: true });
            return res.json({ user: lodash_1.default.omit(user, ['createdAt', 'updatedAt', 'deletedAt']) });
        });
    }
    static getMatches(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield orms_1.User.findOne({ where: { id: req.user.id } });
            if (!user) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'User does not exist' });
            }
            const normalizedMatches = yield user_service_1.UserService.getUserMatches(user);
            return res.json({ matches: normalizedMatches });
        });
    }
    static addMatch(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const match = yield orms_1.User.findOne({ where: { id: req.body.matchId } });
            const user = yield orms_1.User.findOne({ where: { id: req.user.id } });
            if (!match || !user) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'Match or User does not exist' });
            }
            yield user.addMatch(match);
            yield match.addMatch(user);
            const normalizedMatches = yield user_service_1.UserService.getUserMatches(user);
            return res.json({ matches: normalizedMatches });
        });
    }
    static updateMatch(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield orms_1.User.findOne({ where: { id: req.user.id } });
            const match = yield orms_1.User.findOne({ where: { id: req.body.matchId } });
            if (!user || !match) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'User or Match does not exist' });
            }
            if (user.id === match.id) {
                res.status(http_status_1.default.BAD_REQUEST);
                return res.json({ message: 'User cant match with himself' });
            }
            try {
                yield user_service_1.UserService.updateUserMatchStatus(user, match, req.body.status);
            }
            catch (message) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message });
            }
            const normalizedMatches = yield user_service_1.UserService.getUserMatches(user);
            return res.json({ matches: normalizedMatches });
        });
    }
    static deleteMatch(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield orms_1.User.findOne({ where: { id: req.user.id } });
            const match = yield orms_1.User.findOne({ where: { id: req.body.matchId } });
            if (!user || !match) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'User or Match does not exist' });
            }
            user.removeMatch(match);
            match.removeMatch(user);
            const normalizedMatches = yield user_service_1.UserService.getUserMatches(user);
            return res.json({ matches: normalizedMatches });
        });
    }
    static getParties(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield orms_1.User.findOne({ where: { id: req.user.id } });
            if (!user) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'User does not exist' });
            }
            const normalizedParties = yield user_service_1.UserService.getUserParties(user);
            return res.json({ parties: normalizedParties });
        });
    }
    static getPartiesThatUserCanGoTo(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield orms_1.User.findOne({ where: { id: req.user.id } });
            if (!user) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'User does not exist' });
            }
            const normalizedParties = yield user_service_1.UserService.getPartiesUserCanGoTo(user);
            return res.json({ parties: normalizedParties });
        });
    }
    static addParty(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const party = yield orms_1.Party.findOne({ where: { id: req.body.partyId } });
            const user = yield orms_1.User.findOne({ where: { id: req.user.id } });
            if (!party || !user) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'Party or User does not exist' });
            }
            yield user.addParty(party);
            const normalizedParties = yield user_service_1.UserService.getUserParties(user);
            return res.json({ parties: normalizedParties });
        });
    }
    static cancelParty(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const party = yield orms_1.Party.findOne({ where: { id: req.body.partyId } });
            const user = yield orms_1.User.findOne({ where: { id: req.user.id } });
            if (!party || !user) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'Party or User does not exist' });
            }
            yield user.removeParty(party);
            const normalizedParties = yield user_service_1.UserService.getUserParties(user);
            return res.json({ parties: normalizedParties });
        });
    }
}
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        phoneNumber: joi_1.default.string().required(),
    }))
], UserController, "createLoginVerificationAndCheckIfUserExisits", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        phoneNumber: joi_1.default.string().required(),
        code: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        gender: joi_1.default.string().valid(...Object.values(types_1.Gender)).required(),
        address: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        job: joi_1.default.string().required(),
        imgs: joi_1.default.array().items({ uri: joi_1.default.string() }),
        interests: joi_1.default.array().items(joi_1.default.string()),
    }))
], UserController, "subscribe", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        phoneNumber: joi_1.default.string().required(),
        code: joi_1.default.string().required(),
    }))
], UserController, "login", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({}))
], UserController, "getUser", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        address: joi_1.default.string().optional(),
        description: joi_1.default.string().optional(),
        job: joi_1.default.string().optional(),
        imgs: joi_1.default.array().items({ uri: joi_1.default.string() }).optional(),
        interests: joi_1.default.array().items(joi_1.default.string()).optional(),
    }))
], UserController, "updateUser", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({}))
], UserController, "getMatches", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        matchId: joi_1.default.number().required(),
    }))
], UserController, "addMatch", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        matchId: joi_1.default.number().required(),
        status: joi_1.default.string().valid(...Object.values(types_1.MatchStatus)).invalid(types_1.MatchStatus.ACCEPTED).invalid(types_1.MatchStatus.UNCHECKED).required(),
    }))
], UserController, "updateMatch", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        matchId: joi_1.default.number().required(),
    }))
], UserController, "deleteMatch", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({}))
], UserController, "getParties", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({}))
], UserController, "getPartiesThatUserCanGoTo", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        partyId: joi_1.default.number().required(),
    }))
], UserController, "addParty", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        partyId: joi_1.default.number().required(),
    }))
], UserController, "cancelParty", null);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map