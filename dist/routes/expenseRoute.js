"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userauth_1 = __importDefault(require("../middleware/userauth"));
const expenseController_1 = __importDefault(require("../controller/expenseController"));
const route = express_1.default.Router();
route.get("/all", userauth_1.default.auth, expenseController_1.default.getAllExpense);
route.get("/sig/:id", userauth_1.default.auth, expenseController_1.default.getSingleExpense);
route.put("/sig/:id", userauth_1.default.auth, expenseController_1.default.updateExpense);
route.post("/add", userauth_1.default.auth, expenseController_1.default.addExpense);
route.delete("/delete/:id", userauth_1.default.auth, expenseController_1.default.deleteExpense);
exports.default = route;
