import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";

interface ForgotAttributes {
  id: number;
  otp: number;
  userId: number;
}

class Forgot extends Model<ForgotAttributes> implements ForgotAttributes {
  public id!: number;
  public otp!: number;
  public userId!: number;
}

Forgot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Forgot",
    tableName: "forgots",
  }
);

export { Forgot };
