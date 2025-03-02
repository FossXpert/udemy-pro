"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersAnalytics = exports.getCoursesAnalytics = exports.getUserAnalytics = void 0;
const errorHandlers_1 = __importDefault(require("../utills/errorHandlers"));
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const analyticsGenerator_1 = require("../utills/analyticsGenerator");
const user_1 = require("../models/user");
const course_1 = __importDefault(require("../models/course"));
const order_1 = __importDefault(require("../models/order"));
//get user analytics -- Only for Admin
exports.getUserAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const users = await (0, analyticsGenerator_1.generateLast12MonthsData)(user_1.userModel);
        res.status(200).json({
            success: true,
            users
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
//get course analytics - admin only
exports.getCoursesAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const courses = await (0, analyticsGenerator_1.generateLast12MonthsData)(course_1.default);
        res.status(200).json({
            success: true,
            courses
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.getOrdersAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const orders = await (0, analyticsGenerator_1.generateLast12MonthsData)(order_1.default);
        res.status(200).json({
            success: true,
            orders
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
