"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandlers_1 = __importDefault(require("../utills/errorHandlers"));
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal server error';
    //Wrong Mongodb Error
    if (err.name === 'CastError') {
        const message = `Resource Not Found. Invalid : ${err.path}`;
        err = new errorHandlers_1.default(message, 400);
    }
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new errorHandlers_1.default(message, 400);
    }
    if (err.name === 'JsonWebTokenError') {
        const message = 'Json Webtoken is invalid, try again';
        err = new errorHandlers_1.default(message, 400);
    }
    if (err.name === 'TokenExpiredError') {
        const message = 'Json Webtoken is Expired, try again';
        err = new errorHandlers_1.default(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
exports.default = errorMiddleware;
