import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  isPremium: boolean;
  totalCost: number;
  isVerified: boolean;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public isPremium!: boolean;
  public totalCost!: number;
  public isVerified!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPremium: { type: DataTypes.BOOLEAN, defaultValue: false },
    totalCost: { type: DataTypes.INTEGER, defaultValue: 0 },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

export { User };
