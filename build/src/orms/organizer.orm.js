"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organizer = exports.associateOrganizer = exports.initOrganizer = void 0;
const sequelize_1 = require("sequelize");
const party_orm_1 = require("orms/party.orm");
const types_1 = require("models/types");
class Organizer extends sequelize_1.Model {
}
exports.Organizer = Organizer;
const initOrganizer = (sequelize) => {
    Organizer.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        phoneNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        userName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        imgs: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
        },
        foods: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
        },
        drinks: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(types_1.OrganizerStatus.Accepted, types_1.OrganizerStatus.Rejected, types_1.OrganizerStatus.Pending),
            allowNull: false,
            defaultValue: types_1.OrganizerStatus.Pending
        },
    }, { sequelize, paranoid: true });
};
exports.initOrganizer = initOrganizer;
const associateOrganizer = () => {
    Organizer.hasMany(party_orm_1.Party);
};
exports.associateOrganizer = associateOrganizer;
//# sourceMappingURL=organizer.orm.js.map