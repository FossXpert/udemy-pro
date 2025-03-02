"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
require('dotenv').config();
const redis_1 = __importDefault(require("./redis"));
// Convert expiration time correctly (Assuming process.env values are in minutes)
const accessTokenExp = parseInt(process.env.ACCESS_EXP_TIME || '300', 10) * 60 * 1000; // Convert minutes to milliseconds
const refreshTokenExp = parseInt(process.env.REFRESH_EXP_TIME || '1200', 10) * 60 * 1000; // Convert minutes to milliseconds
// Function to get IST time (UTC +5:30)
const getISTDate = (duration) => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // Convert 5.5 hours to milliseconds
    const dateNow = new Date(now.getTime() + duration + istOffset);
    console.log("dateNow", dateNow);
    return dateNow;
};
exports.accessTokenOptions = {
    expires: getISTDate(accessTokenExp),
    httpOnly: true,
    maxAge: accessTokenExp, // Should be in milliseconds
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production' // Set secure flag in production only
};
exports.refreshTokenOptions = {
    expires: getISTDate(refreshTokenExp),
    httpOnly: true,
    maxAge: refreshTokenExp, // Should be in milliseconds
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production' // Set secure flag in production only
};
const sendToken = async (user, statusCode, res) => {
    const accessToken = await user.signAccessToken(); // it has effect
    const refreshToken = await user.signRefreshToken(); // 
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);
    //upload session to redis
    redis_1.default?.set(user._id, JSON.stringify(user));
    if (process.env.NODE_ENV == 'production') {
        exports.accessTokenOptions.secure = true;
        exports.refreshTokenOptions.secure = true;
    }
    res.cookie('access_token', accessToken, exports.accessTokenOptions);
    res.cookie('refresh_token', refreshToken, exports.refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
        refreshToken,
    });
};
exports.sendToken = sendToken;
