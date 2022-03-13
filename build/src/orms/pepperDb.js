"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pepperDb = exports.syncDbModels = exports.initDb = void 0;
const tslib_1 = require("tslib");
const sequelize_1 = require("sequelize");
require("dotenv/config");
if (!process.env.DB_NAME || !process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
    throw 'Database credentials non provided';
}
const pepperDb = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5439,
    dialect: 'postgres',
    logQueryParameters: false,
    logging: false
});
exports.pepperDb = pepperDb;
const initDb = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    try {
        yield pepperDb.authenticate();
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
exports.initDb = initDb;
const syncDbModels = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield pepperDb.sync({ force: true });
});
exports.syncDbModels = syncDbModels;
//# sourceMappingURL=pepperDb.js.map