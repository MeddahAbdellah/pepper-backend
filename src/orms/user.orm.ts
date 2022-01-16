import { Model, DataTypes, Sequelize } from 'sequelize';
import { MatchStatus } from 'models/types';
import { Gender } from 'models/types';
import { Party } from 'orms/party.orm';

class UserMatch extends Model {}
class User extends Model {}

const initUser = (sequelize: Sequelize) => {
  UserMatch.init({
    status: {
      type: DataTypes.ENUM(MatchStatus.ACCEPTED, MatchStatus.UNAVAILABLE, MatchStatus.UNCHECKED, MatchStatus.WAITING),
      allowNull: false,
      defaultValue: MatchStatus.UNAVAILABLE,
    },
  }, { sequelize, paranoid: true });

  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM(Gender.MAN, Gender.WOMAN),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    job: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgs: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    interests: {
      type: DataTypes.JSON,
      allowNull: false,
    }
  }, { sequelize, paranoid: true });
};

const associateUser = () => {
  User.belongsToMany(User, { through: UserMatch, as: 'Matches' });
  User.belongsToMany(Party, { through: 'UserParties', as: 'Parties' });
}

export { initUser, associateUser, User };