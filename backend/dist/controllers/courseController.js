"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideoUrl = exports.reviewReply = exports.addReview = exports.addAnswer = exports.addQuestion = exports.getCourseByUser = exports.deleteCourseById = exports.getAllCourses = exports.getAllCourse = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandlers_1 = __importDefault(require("../utills/errorHandlers"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const course_1 = __importDefault(require("../models/course"));
const courseServices_1 = require("../services/courseServices");
const redis_1 = __importDefault(require("../utills/redis"));
const mongoose_1 = __importDefault(require("mongoose"));
const sendMail_1 = __importDefault(require("../utills/sendMail"));
const notification_1 = __importDefault(require("../models/notification"));
const axios_1 = __importDefault(require("axios"));
//1
exports.uploadCourse = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: 'courses'
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
        (0, courseServices_1.createCourse)(data, req, res, next);
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
//2
exports.editCourse = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: 'courses'
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
        const course = await course_1.default.findByIdAndUpdate(courseId, { $set: data }, { new: true });
        if (!course) {
            return next(new errorHandlers_1.default('Failed to update course', 400));
        }
        const createdCourse = await course_1.default.findById(courseId);
        await redis_1.default?.set(createdCourse?._id.toString(), JSON.stringify(createdCourse));
        res.status(201).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.getSingleCourse = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const course = await redis_1.default?.get(req.params.id);
        if (course) {
            return res.status(201).json({
                success: true,
                course: JSON.parse(course)
            });
        }
        else {
            const course = await course_1.default.findById(req.params.id);
            if (!course) {
                return next(new errorHandlers_1.default('Failed to fetch single course', 400));
            }
            await redis_1.default?.set(req.params.id, JSON.stringify(course));
            return res.status(201).json({
                success: true,
                course
            });
        }
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
//Get all Courses
exports.getAllCourse = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        (0, courseServices_1.getAllCoursesService)(res, next);
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.getAllCourses = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const coursesMongo = await course_1.default.find();
        if (!coursesMongo) {
            return next(new errorHandlers_1.default('Failed to fetch all course', 400));
        }
        return res.status(201).json({
            success: true,
            Allcourses: coursesMongo
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
//Delete Course - admin only
exports.deleteCourseById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const courseArray = ["67cc6da0e4d373b55862e146", "67cbf4c8f65a669ef3e863c8"];
        if (courseArray.includes(courseId)) {
            return next(new errorHandlers_1.default("On purpose this course cannot be deleted, try to delete other courses", 400));
        }
        console.log(courseId);
        const course = await course_1.default.findById(courseId);
        if (!course) {
            return next(new errorHandlers_1.default('Course not found', 400));
        }
        await course.deleteOne({ courseId });
        await redis_1.default?.del(courseId);
        return res.status(200).json({
            success: true,
            message: "Course deleted SuccessFully"
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
//wasted
exports.getCourseByUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userCourses = req.user.courses;
        const courseId = req.params.id;
        const isCourseExist = userCourses.find((a) => a.courseId.toString() === courseId.toString());
        console.log("(req as jwtPayloadNew).user", req.user);
        console.log("userCourse", userCourses);
        if (!isCourseExist) {
            return next(new errorHandlers_1.default(`You haven't bought this Course !`, 400));
        }
        const course = await course_1.default.findById(courseId);
        if (!course) {
            return next(new errorHandlers_1.default(`Unable to fetch this course by ID !`, 400));
        }
        const content = course.courseData;
        res.status(200).json({
            success: true,
            content
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.addQuestion = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { question, courseId, contentId } = req.body;
        const course = await course_1.default.findById(courseId);
        // Remember ContentID IS basically, used to find the courseData one video
        if (!course) {
            return next(new errorHandlers_1.default(`Failed to fetch course in question route`, 400));
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new errorHandlers_1.default(`ContentId : ${contentId} is not valid`, 400));
        }
        const courseContent = course.courseData.find((a) => a._id.equals(contentId));
        if (!courseContent) {
            return next(new errorHandlers_1.default(`Failed to find course with contentId : ${contentId}`, 400));
        }
        //Create a new Question Object
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        courseContent.questions.push(newQuestion);
        await course.save();
        await notification_1.default.create({
            title: `New Questions Asked in ${course.name}`,
            message: `You have a new question asked in ${courseContent.title}`,
            userId: req.user._id
        });
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.addAnswer = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { answer, courseId, contentId, questionId } = req.body;
        const user = req.user;
        const course = await course_1.default.findById(courseId);
        if (!course) {
            return next(new errorHandlers_1.default(`Failed to fetch course in question route`, 400));
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new errorHandlers_1.default(`ContentId : ${contentId} is not valid`, 400));
        }
        const courseContent = course.courseData.find((a) => a._id.equals(contentId));
        console.log("courseContent : ", courseContent);
        console.log("courseData : ", course.courseData);
        if (courseContent === null || courseContent === undefined) {
            return next(new errorHandlers_1.default(`Failed to find course with contentId : ${contentId}`, 400));
        }
        const courseQuestion = courseContent.questions.find((a) => a._id.equals(questionId));
        if (!courseQuestion) {
            return next(new errorHandlers_1.default(`Failed to find Question with QuestionId : ${questionId}`, 400));
        }
        const newAnswer = {
            user: user,
            answer,
        };
        courseQuestion.questionReplies?.push(newAnswer);
        await course.save();
        if (user._id === courseQuestion.user._id) {
            // if both user id is same, it mean it a reply
            //create a notification
            await notification_1.default.create({
                title: `You have a new Reply in this course ${course.name}`,
                message: `You have a new reply in this video ${courseContent.title}`,
                userId: req.user._id
            });
            const data = {
                name: courseQuestion.user.name,
                title: courseContent.title
            };
            try {
                await (0, sendMail_1.default)({
                    email: courseQuestion.user.email,
                    subject: 'Question Replies',
                    template: 'questionReplies.ejs',
                    data
                });
            }
            catch (error) {
                return next(new errorHandlers_1.default(`Failed to send Email due to this error : ${error.message}`, 400));
            }
        }
        else {
            //send one email
            console.log("Hiiii");
        }
        res.status(200).json({
            success: await (0, catchAsyncError_1.success)(res.statusCode),
            course
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.addReview = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { comment } = req.body;
        const user = req.user;
        const courseList = user.courses;
        const courseId = req.params.id;
        const isCourseExist = courseList.find(a => a.courseId === courseId);
        if (!isCourseExist) {
            return next(new errorHandlers_1.default(`You Are Not Allowed to Access This Course Mate`, 400));
        }
        const course = await course_1.default.findById(courseId);
        if (!course) {
            return next(new errorHandlers_1.default(`Error in getting course`, 400));
        }
        const reviewData = {
            user: user,
            rating: 5.0,
            comment: comment
        };
        course.reviews.push(reviewData);
        let avg = 0.0;
        let count = 0.0;
        course.reviews.forEach((rev) => {
            avg += rev.rating;
            count += 1.0;
        });
        course.ratings = avg / course.reviews.length;
        await course.save();
        const notification = {
            title: "New Review Recieved",
            message: `${user.name} had given review in our course : ${course.name}`,
            userId: req.user._id
        };
        await notification_1.default.create({
            notification
        });
        res.status(200).json({
            success: true,
            course, notification
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.reviewReply = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { comment, courseId, reviewId } = req.body;
        const user = req.user;
        const course = await course_1.default.findById(courseId);
        if (!course) {
            return next(new errorHandlers_1.default('failed to fetch course', 400));
        }
        const review = course.reviews.find((a) => a._id.equals(reviewId));
        if (!review) {
            return next(new errorHandlers_1.default(`Failed to find review with review ID : ${reviewId}`, 400));
        }
        const reviewReplyData = {
            user, comment
        };
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        review.commentReplies?.push(reviewReplyData);
        await course.save();
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.generateVideoUrl = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { videoId } = req.body;
        const response = await axios_1.default.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
