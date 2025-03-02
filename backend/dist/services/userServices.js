"use strict";
//get user by id
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersService = exports.getUserById = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandlers_1 = __importDefault(require("../utills/errorHandlers"));
const redis_1 = __importDefault(require("../utills/redis"));
const user_1 = require("../models/user");
const getUserById = async (id, res, next) => {
    try {
        const user = await redis_1.default?.get(id);
        if (!user) {
            return next(new errorHandlers_1.default('Failed to retrieve user by ID', 400));
        }
        const JsonUser = JSON.parse(user);
        return res.status(200).json({
            success: await (0, catchAsyncError_1.success)(res.statusCode), user: JsonUser,
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
};
exports.getUserById = getUserById;
//Get all users
const getAllUsersService = async (res, next) => {
    try {
        const users = await user_1.userModel.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            users
        });
    }
    catch (error) {
        throw error.message;
    }
};
exports.getAllUsersService = getAllUsersService;
