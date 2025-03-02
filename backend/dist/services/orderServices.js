"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersService = exports.newOrder = void 0;
const order_1 = __importDefault(require("../models/order"));
const newOrder = async (data, res) => {
    try {
        const order = await order_1.default.create(data);
        return res.status(200).json({
            success: true,
            message: `You have successfully bought the course`,
            order
        });
    }
    catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};
exports.newOrder = newOrder;
const getAllOrdersService = async (res, next) => {
    try {
        const allOrders = await order_1.default.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            allOrders
        });
    }
    catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};
exports.getAllOrdersService = getAllOrdersService;
