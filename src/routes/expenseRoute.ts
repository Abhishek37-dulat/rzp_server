import express from "express";
import AuthMiddleWare from "../middleware/userauth";
import ExpenseController from "../controller/expenseController";

const route = express.Router();

route.get("/all", AuthMiddleWare.auth, ExpenseController.getAllExpense);
route.get("/sig/:id", AuthMiddleWare.auth, ExpenseController.getSingleExpense);
route.put("/sig/:id", AuthMiddleWare.auth, ExpenseController.updateExpense);
route.post("/add", AuthMiddleWare.auth, ExpenseController.addExpense);
route.delete(
  "/delete/:id",
  AuthMiddleWare.auth,
  ExpenseController.deleteExpense
);

export default route;
