"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotification = exports.getNotifications = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandlers_1 = __importDefault(require("../utills/errorHandlers"));
const node_cron_1 = __importDefault(require("node-cron"));
const notification_1 = __importDefault(require("../models/notification"));
//get all notification --- only for admin
exports.getNotifications = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const notification = await notification_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            notification
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
// Update notification Status : Only for admin
exports.updateNotification = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { notificationId } = req.body;
        const notification = await notification_1.default.findById(notificationId);
        if (!notification) {
            return next(new errorHandlers_1.default(`Notification with notification id ${notificationId} not found\n`, 400));
        }
        notification.status = 'read';
        await notification.save();
        //To see read notification in fronend fetch latest,notification
        const notifications = await notification_1.default.find().sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            NotificationStatus: notification.status,
            updatedNotifications: notifications
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
//delete Notification-ONLY ADMIN
node_cron_1.default.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await notification_1.default.deleteMany({ status: 'read', createdAt: { $lt: thirtyDaysAgo } });
    console.log('Deleted read Notification');
});
