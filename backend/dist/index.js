"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const app_1 = require("./app");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./utills/db"));
const error_1 = __importDefault(require("./middlewares/error"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const courseRoutes_1 = require("./routes/courseRoutes");
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const notificationRouter_1 = __importDefault(require("./routes/notificationRouter"));
const analyticsRouter_1 = __importDefault(require("./routes/analyticsRouter"));
const layoutRouter_1 = __importDefault(require("./routes/layoutRouter"));
const cartRouter_1 = __importDefault(require("./routes/cartRouter"));
const mongoose_1 = __importDefault(require("mongoose"));
app_1.app.use(express_1.default.json({ limit: '50mb' }));
app_1.app.use((0, cookie_parser_1.default)());
app_1.app.use((0, cors_1.default)({ origin: '*' })); // Allow all origins
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
(0, db_1.default)().then(() => {
    console.log("Server is starting...");
    app_1.app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("Server failed to start due to DB connection issue:", error);
});
app_1.app.use('/api/user', userRoutes_1.default);
app_1.app.use('/api/course', courseRoutes_1.courseRouter);
app_1.app.use('/api/order', orderRoutes_1.default);
app_1.app.use('/api/notification', notificationRouter_1.default);
app_1.app.use('/api/analytics', analyticsRouter_1.default);
app_1.app.use('/api/layout', layoutRouter_1.default);
app_1.app.use('/api/cart', cartRouter_1.default);
app_1.app.use(error_1.default);
app_1.app.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Valid Empty Route",
    });
});
app_1.app.get("/db", async (req, res) => {
    const status = mongoose_1.default.connection.readyState;
    const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"];
    res.json({
        statusCode: status,
        status: states[status] || "Unknown",
    });
});
app_1.app.all('*', (req, res, next) => {
    res.status(404).json({
        message: "Invalid Route",
    });
});
