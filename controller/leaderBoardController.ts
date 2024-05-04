import { User } from "../models/User";
import sequelize from "../utils/database";
import { Expense } from "../models/Expense";
import { Request, Response, NextFunction } from "express";

class LeaderBoardController {
  static async getLeaderBoard(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const leaderBoardOfUsers = await User.findAll({
        attributes: ["id", "name", "totalCost"],
        order: ["totalCost"],
      });
      res.status(200).json({ data: leaderBoardOfUsers });
    } catch (error) {
      console.error("Error while fetching LeaderBoard", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}

export default LeaderBoardController;
