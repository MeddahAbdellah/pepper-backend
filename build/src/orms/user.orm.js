"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserParty = exports.UserMatch = exports.User = exports.associateUser = exports.initUser = void 0;
const sequelize_1 = require("sequelize");
const types_1 = require("models/types");
const types_2 = require("models/types");
const party_orm_1 = require("orms/party.orm");
class UserMatch extends sequelize_1.Model {
}
exports.UserMatch = UserMatch;
class UserParty extends sequelize_1.Model {
}
exports.UserParty = UserParty;
class User extends sequelize_1.Model {
}
exports.User = User;
const initUser = (sequelize) => {
    UserParty.init({
        status: {
            type: sequelize_1.DataTypes.ENUM(types_1.UserPartyStatus.WAITING, types_1.UserPartyStatus.ACCEPTED, types_1.UserPartyStatus.ATTENDED, types_1.UserPartyStatus.REJECTED, types_1.UserPartyStatus.ABSENT),
            allowNull: false,
            defaultValue: types_1.UserPartyStatus.WAITING,
        },
    }, { sequelize, paranoid: false });
    UserMatch.init({
        status: {
            type: sequelize_1.DataTypes.ENUM(types_1.MatchStatus.ACCEPTED, types_1.MatchStatus.WAITING),
            allowNull: false,
            defaultValue: types_1.MatchStatus.WAITING,
        },
    }, { sequelize, paranoid: false });
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: sequelize_1.DataTypes.ENUM(types_2.Gender.MAN, types_2.Gender.WOMAN),
            allowNull: false,
        },
        phoneNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        address: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        job: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        imgs: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
        },
        interests: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        facebook: {
            type: sequelize_1.DataTypes.TEXT,
        },
        instagram: {
            type: sequelize_1.DataTypes.TEXT,
        },
        snapchat: {
            type: sequelize_1.DataTypes.TEXT,
        },
    }, { sequelize, paranoid: true });
};
exports.initUser = initUser;
const associateUser = () => {
    User.belongsToMany(User, { through: UserMatch, as: 'Matches' });
    User.belongsToMany(party_orm_1.Party, { through: UserParty, as: 'Parties' });
};
exports.associateUser = associateUser;
//# sourceMappingURL=user.orm.js.map