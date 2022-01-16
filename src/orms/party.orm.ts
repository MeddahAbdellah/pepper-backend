import { Model, DataTypes, Sequelize } from 'sequelize';
import { Organizer } from 'orms/organizer.orm';

class Party extends Model {}

const initParty = (sequelize: Sequelize) => {
  Party.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    theme: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
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
  }, { sequelize, paranoid: true });
  
};

const associateParty = () => {
  Party.belongsTo(Organizer);
}

export { initParty, associateParty, Party };