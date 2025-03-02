"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
require('dotenv').config();
const redisClient = () => {
    try {
        if (process.env.REDIS_URL) {
            console.log("Redis Connected");
            return new ioredis_1.Redis(process.env.REDIS_URL);
        }
    }
    catch (error) {
        console.log(error.message);
        throw error;
    }
};
exports.default = redisClient();
