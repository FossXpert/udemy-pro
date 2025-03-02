"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const connectionString = process.env.MONGO_URI || '';
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(connectionString);
    }
    catch (error) {
        console.log(error.message);
    }
};
mongoose_1.default.connection.on('connected', () => {
    console.log("MongoDB Connected");
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log("MongoDB Disconnected");
});
mongoose_1.default.connection.on('error', () => {
    console.log("Error in MongoDB Connection");
});
exports.default = connectDB;
