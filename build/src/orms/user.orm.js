"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMatch = exports.User = exports.associateUser = exports.initUser = void 0;
const sequelize_1 = require("sequelize");
const types_1 = require("models/types");
const types_2 = require("models/types");
const party_orm_1 = require("orms/party.orm");
class UserMatch extends sequelize_1.Model {
}
exports.UserMatch = UserMatch;
class User extends sequelize_1.Model {
}
exports.User = User;
const initUser = (sequelize) => {
    UserMatch.init({
        status: {
            type: sequelize_1.DataTypes.ENUM(types_1.MatchStatus.ACCEPTED, types_1.MatchStatus.UNAVAILABLE, types_1.MatchStatus.UNCHECKED, types_1.MatchStatus.WAITING),
            allowNull: false,
            defaultValue: types_1.MatchStatus.UNAVAILABLE,
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
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
        },
        job: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        imgs: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
        },
        interests: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
        }
    }, { sequelize, paranoid: true });
};
exports.initUser = initUser;
const associateUser = () => {
    User.belongsToMany(User, { through: UserMatch, as: 'Matches' });
    User.belongsToMany(party_orm_1.Party, { through: { model: 'UserParties', paranoid: false }, as: 'Parties' });
};
exports.associateUser = associateUser;
//# sourceMappingURL=user.orm.js.map