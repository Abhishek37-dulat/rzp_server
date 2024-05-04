import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import sequelize from "../utils/database";
import { Expense } from "../models/Expense";

interface ExpenseData {
  id: number;
  itemName: string;
  categorie: string;
  amount: number;
  userId: number;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  password: string;
  isPremium: boolean;
  totalCost: number;
  isVerified: boolean;
}

class ExpenseController {
  static async getAllExpense(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const Expenses = await Expense.findAll({
        where: { userId: req.user.id },
      });
      res.status(200).json({ message: "User Expensives!", data: Expenses });
    } catch (error) {
      console.error("Error while fetching All Expense");
      res.status(500).json({ message: "Server Error" });
    }
  }
  static async getSingleExpense(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const SingleExpense = await Expense.findByPk(req.user.id);
      if (!SingleExpense) {
        res.status(404).json({ message: "Expense no longer Exist" });
        return;
      }
      res.status(200).json({ message: "Single Expense", data: SingleExpense });
    } catch (error) {
      console.error("Error while fetching single expense");
      res.status(500).json({ message: "Server Error" });
    }
  }
  static async addExpense(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const t = await sequelize.transaction();
    try {
      const {
        itemName,
        categorie,
        amount,
      }: { itemName: string; categorie: string; amount: number } = req.body;
      if (!itemName || !categorie || !amount) {
        res.status(403).json({ message: "All fields are required" });
        return;
      }
      const expenseItem: ExpenseData = await Expense.create(
        {
          itemName,
          categorie,
          amount,
          userId: req.user.id,
        } as ExpenseData,
        { transaction: t }
      );
      const user = await User.findByPk(req.user.id);
      await user?.update(
        {
          totalCost:
            user.totalCost === null || user.totalCost === 0
              ? amount
              : user.totalCost + amount,
        } as UserData,
        { transaction: t }
      );
      await t.commit();
      res.status(201).json({ message: "Expense Created", data: expenseItem });
    } catch (error) {
      await t.rollback();
      console.error("Error while adding Expense");
      res.status(500).json({ message: "Server Error" });
    }
  }

  static async updateExpense(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const t = await sequelize.transaction();
    try {
      const {
        itemName,
        categorie,
        amount,
      }: { itemName: string; categorie: string; amount: number } = req.body;
      if (!itemName || !categorie || !amount) {
        res.status(403).json({ message: "All fields are required" });
        return;
      }
      const expenseExist = await Expense.findByPk(req.params.id, {
        transaction: t,
      });
      if (!expenseExist) {
        res.status(403).json({ message: "Expense not Exist" });
        return;
      }
      const user = await User.findByPk(req.user.id);
      await user?.update(
        {
          totalCost: user.totalCost - expenseExist.amount,
        } as UserData,
        { transaction: t }
      );

      const expenseDetail: ExpenseData = await expenseExist?.update(
        {
          itemName,
          categorie,
          amount,
          userId: req.user.id,
        } as ExpenseData,
        { transaction: t }
      );
      await t.commit();
      res.status(202).json({ message: "Updated Expense" });
    } catch (error) {
      await t.rollback();
      console.error("SERVER ERROR :: Error while updating expense");
      res.status(500).json({ message: "Server Error" });
    }
  }

  static async deleteExpense(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const t = await sequelize.transaction();
    try {
      const expenseExist = await Expense.findByPk(req.user.id, {
        transaction: t,
      });
      if (!expenseExist) {
        res.status(403).json({ message: "Cann't find expense" });
        return;
      }
      const userExist = await User.findByPk(req.user.id);
      if (!userExist) {
        res.status(403).json({ message: "Cann't find User" });
        return;
      }
      await userExist?.update(
        {
          totalCost: userExist.totalCost - expenseExist?.amount,
        } as UserData,
        { transaction: t }
      );
      await expenseExist?.destroy();
      await t.commit();
      res.status(200).json({ message: "Expense Deleted" });
    } catch (error) {
      await t.rollback();
      console.error("Error while deleting Expense");
      res.status(500).json({ message: "Server Error" });
    }
  }
}

export default ExpenseController;
