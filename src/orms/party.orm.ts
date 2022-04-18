import { Model, DataTypes, Sequelize, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin, HasManyRemoveAssociationMixin, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin } from 'sequelize';
import { Organizer } from 'orms/organizer.orm';
import { User, UserParty } from './user.orm';

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

  public getUsers!: HasManyGetAssociationsMixin<User>;
  public addUser!: HasManyAddAssociationMixin<User, number>;
  public hasUser!: HasManyHasAssociationMixin<User, number>;
  public countUsers!: HasManyCountAssociationsMixin;
  public removeUser!: HasManyRemoveAssociationMixin<User, number>;
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
  Party.belongsToMany(User, { through: UserParty, as: 'Users' });
}

export { initParty, associateParty, Party };