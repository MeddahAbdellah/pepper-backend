"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizerController = void 0;
const tslib_1 = require("tslib");
const joi_1 = (0, tslib_1.__importDefault)(require("joi"));
const helpers_1 = require("helpers/helpers");
const orms_1 = require("orms");
const http_status_1 = (0, tslib_1.__importDefault)(require("http-status"));
const jsonwebtoken_1 = (0, tslib_1.__importDefault)(require("jsonwebtoken"));
const types_1 = require("models/types");
require("dotenv/config");
const lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
const organizer_service_1 = require("services/organizer/organizer.service");
;
class OrganizerController {
    static subscribe(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const organizerTest = yield orms_1.Organizer.findOne({ where: { userName: req.body.userName }, raw: true });
            if (organizerTest !== null) {
                res.status(http_status_1.default.UNAUTHORIZED);
                return res.json({ message: 'UserName already exists' });
            }
            yield orms_1.Organizer.create({
                userName: req.body.userName,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber,
                title: req.body.title,
                location: req.body.location,
                description: req.body.description,
                imgs: req.body.imgs,
                foods: req.body.foods,
                drinks: req.body.drinks,
                status: types_1.OrganizerStatus.Pending
            });
            const organizer = yield orms_1.Organizer.findOne({
                where: { userName: req.body.userName },
                attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] },
                raw: true,
            });
            if (organizer === null) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'Organizer could not be created!' });
            }
            if (!process.env.JWT_KEY) {
                throw 'JWT key not provided';
            }
            const token = jsonwebtoken_1.default.sign(organizer, process.env.JWT_KEY);
            return res.json({ token });
        });
    }
    static login(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const organizer = yield orms_1.Organizer.findOne({ where: { userName: req.body.userName, password: req.body.password }, raw: true });
            if (!organizer) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'Organizer does not exist' });
            }
            const isAuthorized = organizer.status !== types_1.OrganizerStatus.Rejected;
            if (!isAuthorized) {
                res.status(http_status_1.default.UNAUTHORIZED);
                return res.json({ message: 'Organizer not validated yet' });
            }
            if (!process.env.JWT_KEY) {
                throw 'JWT key not provided';
            }
            const token = jsonwebtoken_1.default.sign(organizer, process.env.JWT_KEY);
            return res.json({ token });
        });
    }
    static getOrganizer(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const organizer = yield orms_1.Organizer.findOne({ where: { id: req.organizer.id }, raw: true });
            if (!organizer) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'Organizer does not exist' });
            }
            return res.json({ organizer: lodash_1.default.omit(organizer, ['createdAt', 'updatedAt', 'deletedAt', 'password']) });
        });
    }
    static updateOrganizer(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield orms_1.Organizer.update(Object.assign({}, req.body), { where: { id: req.organizer.id } });
            const organizer = yield orms_1.Organizer.findOne({ where: { id: req.organizer.id }, raw: true });
            return res.json({ organizer: lodash_1.default.omit(organizer, ['createdAt', 'updatedAt', 'deletedAt', 'password']) });
        });
    }
    static createNewparty(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const organizer = yield orms_1.Organizer.findOne({ where: { id: req.organizer.id } });
            if (!organizer) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'User does not exist' });
            }
            const party = yield orms_1.Party.create({
                theme: req.body.theme,
                date: req.body.date,
                price: req.body.price,
                people: req.body.people,
                minAge: req.body.minAge,
                maxAge: req.body.maxAge,
            });
            yield organizer.addParty(party);
            const normalizedParties = yield organizer_service_1.OrganizerService.getOrganizerParties(organizer);
            return res.json({ parties: normalizedParties });
        });
    }
    static getOrganizerParties(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const organizer = yield orms_1.Organizer.findOne({ where: { id: req.organizer.id } });
            if (!organizer) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'User does not exist' });
            }
            const normalizedParties = yield organizer_service_1.OrganizerService.getOrganizerParties(organizer);
            return res.json({ parties: normalizedParties });
        });
    }
    static deleteParty(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const organizer = yield orms_1.Organizer.findOne({ where: { id: req.organizer.id } });
            const party = yield orms_1.Party.findByPk(req.body.partyId);
            const partyOrganizer = yield (party === null || party === void 0 ? void 0 : party.getOrganizer());
            if ((partyOrganizer != undefined) && (party != null) && (partyOrganizer.id == req.organizer.id)) {
                yield party.destroy();
            }
            if (!organizer) {
                res.status(http_status_1.default.NOT_FOUND);
                return res.json({ message: 'User does not exist' });
            }
            const normalizedParties = yield organizer_service_1.OrganizerService.getOrganizerParties(organizer);
            return res.json({ parties: normalizedParties });
        });
    }
}
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        userName: joi_1.default.string().required(),
        phoneNumber: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
        title: joi_1.default.string().required(),
        location: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        imgs: joi_1.default.array().items({ uri: joi_1.default.string() }),
        foods: joi_1.default.array().items({ name: joi_1.default.string(), price: joi_1.default.number() }),
        drinks: joi_1.default.array().items({ name: joi_1.default.string(), price: joi_1.default.number() }),
    }))
], OrganizerController, "subscribe", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        userName: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }))
], OrganizerController, "login", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({}))
], OrganizerController, "getOrganizer", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        title: joi_1.default.string().optional(),
        location: joi_1.default.string().optional(),
        description: joi_1.default.string().optional(),
        imgs: joi_1.default.array().items({ uri: joi_1.default.string() }).optional(),
        foods: joi_1.default.array().items({ name: joi_1.default.string(), price: joi_1.default.number() }).optional(),
        drinks: joi_1.default.array().items({ name: joi_1.default.string(), price: joi_1.default.number() }).optional()
    }))
], OrganizerController, "updateOrganizer", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        theme: joi_1.default.string().required(),
        date: joi_1.default.date().required(),
        price: joi_1.default.number().required(),
        people: joi_1.default.number().required(),
        minAge: joi_1.default.number().required(),
        maxAge: joi_1.default.number().required(),
    }))
], OrganizerController, "createNewparty", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({}))
], OrganizerController, "getOrganizerParties", null);
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({
        partyId: joi_1.default.number().required(),
    }))
], OrganizerController, "deleteParty", null);
exports.OrganizerController = OrganizerController;
//# sourceMappingURL=organizer.controller.js.map