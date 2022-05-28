import { Model, DataTypes, Sequelize, HasManyGetAssociationsMixin, HasManyCountAssociationsMixin, HasManyHasAssociationMixin, HasManyAddAssociationMixin, HasManySetAssociationsMixin, Association, HasManyRemoveAssociationMixin } from 'sequelize';
import { MatchStatus, IUser, UserPartyStatus } from 'models/types';
import { Gender } from 'models/types';
import { Party } from 'orms/party.orm';

class UserMatch extends Model {
  public status!: MatchStatus;
}

class UserParty extends Model {
  public status!: UserPartyStatus;
}

class User extends Model {
  public id!: number;
  public name!: string;
  public gender!: Gender;
  public phoneNumber!: string;
  public address!: string;
  public description!: string;
  public job!: string;
  public imgs!: Array<{ uri: string}>;
  public interests!: string[];
  public facebook!: string;
  public instagram!: string;
  public snapchat!: string;
  public readonly matches!: UserMatch[];
  public readonly parties!: Party[];

  public static associations: {
    matches: Association<User, User>;
    parties: Association<User, Party>;
  };

  public readonly dataValues!: IUser;

  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;

  public getMatches!: HasManyGetAssociationsMixin<User>;
  public setMatch!: HasManySetAssociationsMixin<User, number>;
  public addMatch!: HasManyAddAssociationMixin<User, number>;
  public hasMatch!: HasManyHasAssociationMixin<User, number>;
  public countMatches!: HasManyCountAssociationsMixin;
  public removeMatch!: HasManyRemoveAssociationMixin<User, number>;

  public getParties!: HasManyGetAssociationsMixin<Party>;
  public addParty!: HasManyAddAssociationMixin<Party, number>;
  public hasParty!: HasManyHasAssociationMixin<Party, number>;
  public countParties!: HasManyCountAssociationsMixin;
  public removeParty!: HasManyRemoveAssociationMixin<Party, number>;
}

const initUser = (sequelize: Sequelize) => {
  UserParty.init({
    status: {
      type: DataTypes.ENUM(UserPartyStatus.WAITING, UserPartyStatus.ACCEPTED, UserPartyStatus.ATTENDED, UserPartyStatus.REJECTED, UserPartyStatus.ABSENT),
      allowNull: false,
      defaultValue: UserPartyStatus.WAITING,
    },
  }, { sequelize, paranoid: false });

  UserMatch.init({
    status: {
      type: DataTypes.ENUM(MatchStatus.ACCEPTED,MatchStatus.WAITING),
      allowNull: false,
      defaultValue: MatchStatus.WAITING,
    },
  }, { sequelize, paranoid: false });

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
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    job: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imgs: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    interests: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    facebook: {
      type: DataTypes.TEXT,
    },
    instagram: {
      type: DataTypes.TEXT,
    },
    snapchat: {
      type: DataTypes.TEXT,
    },
  }, { sequelize, paranoid: true });
};

const associateUser = () => {
  User.belongsToMany(User, { through: UserMatch, as: 'Matches' });
  User.belongsToMany(Party, { through: UserParty, as: 'Parties' });
}

export { initUser, associateUser, User, UserMatch, UserParty };