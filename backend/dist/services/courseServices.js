"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCoursesService = exports.createCourse = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandlers_1 = __importDefault(require("../utills/errorHandlers"));
const course_1 = __importDefault(require("../models/course"));
const user_1 = require("../models/user");
const category_1 = __importDefault(require("../models/category"));
const redis_1 = __importDefault(require("../utills/redis"));
const createCourse = async (data, req, res, next) => {
    try {
        const course = await course_1.default.create(data);
        const categoryName = "ML";
        const cat = await category_1.default.findOne({ 'categories.categoryName': categoryName });
        const user = req.user;
        const userId = user._id;
        const userData = await user_1.userModel.findById(userId);
        if (userData) {
            userData.postedCourse?.push(course._id);
            await userData.save();
        }
        course.postedBy = {
            userId: userData?._id,
            name: userData?.name,
            email: userData?.email
        };
        if (cat) {
            course.courseCategory = cat._id;
            const category = cat.categories.find(a => a.categoryName === categoryName);
            if (category) {
                category.containedCourses?.push(course._id);
            }
            await cat.save();
        }
        else {
            return next(new errorHandlers_1.default('Cat Is Undefined', 400));
        }
        await course.save();
        const createdCourse = await course_1.default.findById(course._id);
        await redis_1.default?.set(createdCourse?._id.toString(), JSON.stringify(createdCourse));
        res.status(201).json({
            success: await (0, catchAsyncError_1.success)(res.statusCode),
            course
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
};
exports.createCourse = createCourse;
const getAllCoursesService = async (res, next) => {
    try {
        const Allcourses = await course_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            Allcourses
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getAllCoursesService = getAllCoursesService;
