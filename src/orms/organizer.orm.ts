import { Model, DataTypes, Sequelize } from 'sequelize';
import { Party } from 'orms/party.orm';

class Organizer extends Model {}

const initOrganizer = (sequelize: Sequelize) => {
  Organizer.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    theme: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    people: {
      type: DataTypes.STRING,
    },
    minAge: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxAge: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgs: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foods: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    drinks: {
      type: DataTypes.JSON,
      allowNull: false,
    }
  }, { sequelize, paranoid: true });
};

const associateOrganizer = () => {
  Organizer.hasMany(Party);
}

export { initOrganizer, associateOrganizer, Organizer };