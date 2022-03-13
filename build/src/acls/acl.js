"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeForOrganize = exports.authorizeForUser = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = (0, tslib_1.__importDefault)(require("jsonwebtoken"));
const http_status_1 = (0, tslib_1.__importDefault)(require("http-status"));
require("dotenv/config");
const authorizeForUser = (req, res, next) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    let user;
    try {
        if (!process.env.JWT_KEY) {
            throw 'JWT key not provided';
        }
        user = jsonwebtoken_1.default.verify(req.headers.authorization, process.env.JWT_KEY);
        if (!(user === null || user === void 0 ? void 0 : user.id)) {
            throw 'Does not contain user';
        }
        req.user = user;
        next();
    }
    catch (e) {
        res.status(http_status_1.default.UNAUTHORIZED);
        res.json({
            message: `Invalid token: ${e}`,
        });
    }
});
exports.authorizeForUser = authorizeForUser;
const authorizeForOrganize = (req, res, next) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    let organizer;
    try {
        if (!process.env.JWT_KEY) {
            throw 'JWT key not provided';
        }
        organizer = jsonwebtoken_1.default.verify(req.headers.authorization, process.env.JWT_KEY);
        if (!(organizer === null || organizer === void 0 ? void 0 : organizer.id)) {
            throw 'Does not contain organizer';
        }
        req.organizer = organizer;
        next();
    }
    catch (e) {
        res.status(http_status_1.default.UNAUTHORIZED);
        res.json({
            message: `Invalid token: ${e}`,
        });
    }
});
exports.authorizeForOrganize = authorizeForOrganize;
//# sourceMappingURL=acl.js.map