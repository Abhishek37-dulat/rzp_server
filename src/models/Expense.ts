import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";

interface ExpenseAttributes {
  id: number;
  itemName: string;
  categorie: string;
  amount: number;
  userId: number;
}

class Expense extends Model<ExpenseAttributes> implements ExpenseAttributes {
  public id!: number;
  public itemName!: string;
  public categorie!: string;
  public amount!: number;
  public userId!: number;
}

Expense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categorie: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
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
    modelName: "Expense",
    tableName: "expenses",
  }
);

export { Expense };
