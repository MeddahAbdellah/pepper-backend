"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Party = exports.associateParty = exports.initParty = void 0;
const sequelize_1 = require("sequelize");
const organizer_orm_1 = require("orms/organizer.orm");
const user_orm_1 = require("./user.orm");
class Party extends sequelize_1.Model {
}
exports.Party = Party;
const initParty = (sequelize) => {
    Party.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        theme: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        price: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        people: {
            type: sequelize_1.DataTypes.INTEGER,
        },
        minAge: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        maxAge: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    }, { sequelize, paranoid: true });
};
exports.initParty = initParty;
const associateParty = () => {
    Party.belongsTo(organizer_orm_1.Organizer);
    Party.belongsToMany(user_orm_1.User, { through: user_orm_1.UserParty, as: 'Users' });
};
exports.associateParty = associateParty;
//# sourceMappingURL=party.orm.js.map