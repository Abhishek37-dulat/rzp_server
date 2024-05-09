"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
class Order extends sequelize_1.Model {
}
exports.Order = Order;
Order.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    paymentId: {
        type: sequelize_1.DataTypes.STRING,
    },
    orderId: {
        type: sequelize_1.DataTypes.STRING,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
    },
}, {
    sequelize: database_1.default,
    modelName: "Order",
    tableName: "orders",
});
