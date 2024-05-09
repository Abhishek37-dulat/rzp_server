"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const database_1 = __importDefault(require("../utils/database"));
const Expense_1 = require("../models/Expense");
class ExpenseController {
    static getAllExpense(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Expenses = yield Expense_1.Expense.findAll({
                    where: { userId: req.user.id },
                });
                res.status(200).json({ message: "User Expensives!", data: Expenses });
            }
            catch (error) {
                console.error("Error while fetching All Expense");
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
    static getSingleExpense(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const SingleExpense = yield Expense_1.Expense.findByPk(req.user.id);
                if (!SingleExpense) {
                    res.status(404).json({ message: "Expense no longer Exist" });
                    return;
                }
                res.status(200).json({ message: "Single Expense", data: SingleExpense });
            }
            catch (error) {
                console.error("Error while fetching single expense");
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
    static addExpense(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield database_1.default.transaction();
            try {
                const { itemName, categorie, amount, } = req.body;
                console.log(req.body);
                if (!itemName || !categorie || !amount) {
                    res.status(403).json({ message: "All fields are required" });
                    return;
                }
                const expenseItem = yield Expense_1.Expense.create({
                    itemName,
                    categorie,
                    amount,
                    userId: req.user.id,
                }, { transaction: t });
                const user = yield User_1.User.findByPk(req.user.id);
                yield (user === null || user === void 0 ? void 0 : user.update({
                    totalCost: user.totalCost === 0 ? +amount : +user.totalCost + +amount,
                }, { transaction: t }));
                yield t.commit();
                res.status(201).json({ message: "Expense Created", data: expenseItem });
            }
            catch (error) {
                yield t.rollback();
                console.error("Error while adding Expense", error);
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
    static updateExpense(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield database_1.default.transaction();
            try {
                const { itemName, categorie, amount, } = req.body;
                if (!itemName || !categorie || !amount) {
                    res.status(403).json({ message: "All fields are required" });
                    return;
                }
                const expenseExist = yield Expense_1.Expense.findByPk(req.params.id, {
                    transaction: t,
                });
                if (!expenseExist) {
                    res.status(403).json({ message: "Expense not Exist" });
                    return;
                }
                const user = yield User_1.User.findByPk(req.user.id);
                yield (user === null || user === void 0 ? void 0 : user.update({
                    totalCost: user.totalCost - expenseExist.amount,
                }, { transaction: t }));
                const expenseDetail = yield (expenseExist === null || expenseExist === void 0 ? void 0 : expenseExist.update({
                    itemName,
                    categorie,
                    amount,
                    userId: req.user.id,
                }, { transaction: t }));
                yield t.commit();
                res.status(202).json({ message: "Updated Expense" });
            }
            catch (error) {
                yield t.rollback();
                console.error("SERVER ERROR :: Error while updating expense");
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
    static deleteExpense(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield database_1.default.transaction();
            try {
                const expenseExist = yield Expense_1.Expense.findByPk(req.params.id, {
                    transaction: t,
                });
                if (!expenseExist) {
                    res.status(403).json({ message: "Cann't find expense" });
                    return;
                }
                const userExist = yield User_1.User.findByPk(req.user.id);
                if (!userExist) {
                    res.status(403).json({ message: "Cann't find User" });
                    return;
                }
                yield (userExist === null || userExist === void 0 ? void 0 : userExist.update({
                    totalCost: userExist.totalCost - (expenseExist === null || expenseExist === void 0 ? void 0 : expenseExist.amount),
                }, { transaction: t }));
                yield (expenseExist === null || expenseExist === void 0 ? void 0 : expenseExist.destroy());
                yield t.commit();
                res.status(200).json({ message: "Expense Deleted" });
            }
            catch (error) {
                yield t.rollback();
                console.error("Error while deleting Expense");
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
}
exports.default = ExpenseController;
