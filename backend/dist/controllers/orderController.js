"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = exports.createOrder = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandlers_1 = __importDefault(require("../utills/errorHandlers"));
const order_1 = __importDefault(require("../models/order"));
const user_1 = require("../models/user");
const course_1 = __importDefault(require("../models/course"));
const orderServices_1 = require("../services/orderServices");
const sendMail_1 = __importDefault(require("../utills/sendMail"));
const notification_1 = __importDefault(require("../models/notification"));
exports.createOrder = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { courseId, payment_info } = req.body;
        const user = await user_1.userModel.findById(req.user._id);
        if (!user) {
            return next(new errorHandlers_1.default(`errror in getting user`, 400));
        }
        //checking if user already purchased this course or not
        const isCourseExist = await user.courses.find(a => a.courseId === courseId);
        if (isCourseExist) {
            return next(new errorHandlers_1.default('You have already bought this course', 400));
        }
        const course = await course_1.default.findById(courseId);
        if (!course) {
            return next(new errorHandlers_1.default(`Failed to fetch course`, 400));
        }
        const orderData = {
            courseId: course._id,
            userId: user._id,
            payment_info: payment_info
        };
        console.log('data : ', orderData);
        user.courses.push({ courseId });
        if (course.purchased !== undefined) {
            course.purchased += 1;
        }
        await notification_1.default.create({
            title: 'New Order Created',
            message: `You have successfully bought ${course.name}`,
            userId: user._id,
            status: 'unread'
        });
        await course.save();
        await user.save();
        await (0, orderServices_1.newOrder)(orderData, res);
        const order = await order_1.default.findOne({ userId: user._id }).sort({ createdAt: -1 });
        if (!order) {
            return next(new errorHandlers_1.default('Failed to retrieve latest order mate!', 400));
        }
        const emailData = {
            order: {
                id: order._id,
                name: course.name,
                price: course.price,
                date: order.createdAt
            }
        };
        await (0, sendMail_1.default)({
            email: user.email,
            subject: 'Order Confirmation',
            template: `orderCreation.ejs`,
            data: emailData
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
//Get all orders admin ke liye
exports.getAllOrders = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        (0, orderServices_1.getAllOrdersService)(res, next);
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
