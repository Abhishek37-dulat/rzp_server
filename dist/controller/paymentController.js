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
const razorpay_1 = __importDefault(require("razorpay"));
const Order_1 = require("../models/Order");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class PaymentController {
    static purchase(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.user);
                let rzp = new razorpay_1.default({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_KEY_SECRET,
                });
                const amount = 2500;
                yield rzp.orders.create({ amount, currency: "INR" }, (err, order) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        throw new Error(JSON.stringify(err));
                    }
                    const orderdata = yield Order_1.Order.create({
                        orderId: order.id,
                        status: "PENDING",
                    });
                    res.status(201).json({ order, key_id: rzp.key_id });
                }));
            }
            catch (error) {
                console.error("Error while purchase", error);
                res.status(403).json({ message: "Server error", error });
            }
        });
    }
    static updatePurchase(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { payment_id, order_id } = req.body;
                const order = yield Order_1.Order.findOne({ where: { orderId: order_id } });
                const updatedOrder = yield order.update({
                    paymentId: payment_id,
                    status: "SUCCESSFUL",
                });
                const data = yield req.user.update({ isPremium: true });
                const token = yield jsonwebtoken_1.default.sign({
                    name: data.name,
                    id: data.id,
                    isPremium: data.isPremium,
                    isVerified: data.isVerified,
                }, process.env.TOKEN_SECRET);
                res.status(202).json({
                    sucess: true,
                    message: "Transaction Successful",
                    token: token,
                });
            }
            catch (error) {
                console.error("Error while updating purchase", error);
                res.status(403).json({ error: error, message: "Somethingwent wrong" });
            }
        });
    }
    static updatePurchaseFailed(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { payment_id, order_id } = req.body;
                const order = yield Order_1.Order.findOne({ where: { orderId: order_id } });
                const updatedOrder = yield order.update({
                    paymentId: payment_id,
                    status: "FAILED",
                });
                const data = yield req.user.update({ isPremium: false });
                const token = yield jsonwebtoken_1.default.sign({
                    name: data.name,
                    id: data.id,
                    isPremium: data.isPremium,
                    isVerified: data.isVerified,
                }, process.env.TOKEN_SECRET);
                res.status(202).json({
                    sucess: true,
                    message: "Transaction Successful",
                    token: token,
                });
            }
            catch (error) {
                console.error("Error while purchase Failed", error);
                res.status(403).json({ message: "Server error", error });
            }
        });
    }
}
exports.default = PaymentController;
