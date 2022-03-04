import { Model, DataTypes, Sequelize, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin } from 'sequelize';
import { Organizer } from 'orms/organizer.orm';

class Party extends Model {
  public id!: number;
  public theme!: string;
  public date!: Date;
  public price!: number;
  public people!: number;
  public minAge!: number;
  public maxAge!: number;

  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;

  public getOrganizer!: BelongsToGetAssociationMixin<Organizer>;
  public setOrganizer!: BelongsToSetAssociationMixin<Organizer, number>; 
}
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
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    people: {
      type: DataTypes.INTEGER,
    },
    minAge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxAge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, { sequelize, paranoid: true });
  
};

const associateParty = () => {
  Party.belongsTo(Organizer);
}

export { initParty, associateParty, Party };