"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserRole = exports.isAuthenticated = void 0;
require('dotenv').config();
const catchAsyncError_1 = require("./catchAsyncError");
const errorHandlers_1 = __importDefault(require("../utills/errorHandlers"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
exports.isAuthenticated = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new errorHandlers_1.default('Please login to access this resource', 400));
    }
    const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
    if (!decoded) {
        return next(new errorHandlers_1.default('access token is not valid', 400));
    }
    const user = await user_1.userModel.findById(decoded.id);
    if (!user) {
        return next(new errorHandlers_1.default("user not found", 400));
    }
    req.user = user; // Remember it to how to use custom type
    next();
});
const validateUserRole = (...roles) => {
    const userRole = async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new errorHandlers_1.default(`Role ${req.user.role} is not allowed to access this resourse`, 400));
        }
        next();
    };
    return userRole;
};
exports.validateUserRole = validateUserRole;
