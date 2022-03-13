"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const organizer_route_1 = (0, tslib_1.__importDefault)(require("services/organizer/organizer.route"));
const user_route_1 = (0, tslib_1.__importDefault)(require("services/user/user.route"));
const party_route_1 = (0, tslib_1.__importDefault)(require("services/party/party.route"));
const proxy_route_1 = (0, tslib_1.__importDefault)(require("services/proxy/proxy.route"));
const routes = express_1.default.Router();
routes.use('/organizer', organizer_route_1.default);
routes.use('/user', user_route_1.default);
routes.use('/party', party_route_1.default);
routes.use('/proxy', proxy_route_1.default);
exports.default = routes;
//# sourceMappingURL=routes.js.map