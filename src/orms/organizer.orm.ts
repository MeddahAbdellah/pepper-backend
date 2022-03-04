import {
  Model, DataTypes, Sequelize, 
  HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin,
} from 'sequelize';
import { Party } from 'orms/party.orm';
import { OrganizerStatus } from 'models/types';

class Organizer extends Model {
  public id!: number;
  public phoneNumber!: string;
  public userName!: string;
  public password!: string;
  public title!: string;
  public location!: string;
  public description!: string;
  public imgs!: Array<{ uri: string}>;
  public foods!: Array<{ name: string, price: number }>;
  public drinks!: Array<{ name: string, price: number }>;
  public status!: OrganizerStatus;

  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;

  public getParties!: HasManyGetAssociationsMixin<Party>;
  public addParty!: HasManyAddAssociationMixin<Party, number>;
  public hasParty!: HasManyHasAssociationMixin<Party, number>;
  public countParties!: HasManyCountAssociationsMixin;
}

const initOrganizer = (sequelize: Sequelize) => {
  Organizer.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
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
    foods: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    drinks: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM( OrganizerStatus.Accepted, OrganizerStatus.Rejected, OrganizerStatus.Pending ),
      allowNull: false,
      defaultValue: OrganizerStatus.Pending 
    },
  }, { sequelize, paranoid: true });
};

const associateOrganizer = () => {
  Organizer.hasMany(Party);
}

export { initOrganizer, associateOrganizer, Organizer };