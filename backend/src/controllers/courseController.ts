import { Request, Response, NextFunction } from "express";
import { catchAsyncError, success } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utills/errorHandlers";
import cloudinary from 'cloudinary';
import courseModel, { iComment, iCourse, iCourseData, iReview } from "../models/course";
import { createCourse, getAllCoursesService } from "../services/courseServices";
import redis from "../utills/redis";
import { jwtPayloadNew } from "../middlewares/auth";
import mongoose from 'mongoose';
import { JwtPayload } from "jsonwebtoken";
import ejs from 'ejs';
import path from 'path';
import sendMail from "../utills/sendMail";
import { count } from "console";
import notificationModel from "../models/notification";
import axios from 'axios'

export const uploadCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        
        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: 'courses'
            })
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }
        createCourse(data,req, res, next);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

export const editCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;
        const data = req.body;
        const thumbnail = data.thumbnail;
        const courseData = await courseModel.findById(courseId) as any;

        if (thumbnail && !thumbnail.startsWith("https")) {
            await cloudinary.v2.uploader.destroy(courseData?.thumbnail.public_id)
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: 'courses'
            })
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
            console.log("inside 1")
        }

        if(thumbnail && thumbnail.startsWith("https")){
            data.thumbnail = {
                public_id: courseData.thumbnail.public_id,
                url: courseData.thumbnail.url
            }
            console.log("inside 2")
        }

        
        const course = await courseModel.findByIdAndUpdate(courseId, { $set: data }, { new: true });
        if (!course) {
            return next(new ErrorHandler('Failed to update course', 400))
        }
        res.status(201).json({
            success: true,
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

export const getSingleCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const course = await redis?.get(req.params.id);
        if (course) {
            return res.status(201).json({
                success: true,
                course: JSON.parse(course)
            })
        } else {
            const courseMongo = await courseModel.findById(req.params.id);
            if (!courseMongo) {
                return next(new ErrorHandler('Failed to fetch single course', 400));
            }
            await redis?.set(req.params.id, JSON.stringify(courseMongo));
            return res.status(201).json({
                success: true,
                courseMongo
            })
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

export const getAllCourses = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await redis?.get('courses');
        if (courses) {
            return res.status(201).json({
                success: true,
                Allcourses: JSON.parse(courses)
            })
        }
        else {
            const coursesMongo = await courseModel.find({}).select("-courseData.videoUrl -courseData.links -courseData.questions -courseData.suggestion -courseData.videoLength -courseData.videoPlayer ");
            if (!coursesMongo) {
                return next(new ErrorHandler('Failed to fetch all course', 400));
            }
            await redis?.set('courses', JSON.stringify(coursesMongo));
            return res.status(201).json({
                success: true,
                Allcourses: coursesMongo
            })
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

export const getCourseByUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourses = (req as jwtPayloadNew).user.courses;

        const courseId = req.params.id;
        const isCourseExist = userCourses.find((a: any) => a.courseId.toString() === courseId.toString());

        console.log("(req as jwtPayloadNew).user", (req as jwtPayloadNew).user);
        console.log("userCourse", userCourses);
        if (!isCourseExist) {
            return next(new ErrorHandler(`You haven't bought this Course !`, 400));
        }
        const course = await courseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler(`Unable to fetch this course by ID !`, 400));
        }
        const content = course.courseData;
        res.status(200).json({
            success: true,
            content
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})


//create questions and answer
interface iAddQuestionData {
    question: string;
    courseId: string;
    contentId: string;
}

export const addQuestion = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, courseId, contentId }: iAddQuestionData = req.body;
        const course = await courseModel.findById(courseId);

        // Remember ContentID IS basically, used to find the courseData one video
        if (!course) {
            return next(new ErrorHandler(`Failed to fetch course in question route`, 400));
        }
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler(`ContentId : ${contentId} is not valid`, 400));
        }
        const courseContent = course.courseData.find((a:any) => a._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler(`Failed to find course with contentId : ${contentId}`, 400));
        }

        //Create a new Question Object
        const newQuestion: any = {
            user: (req as jwtPayloadNew).user,
            question,
            questionReplies: [],
        }
        courseContent.questions.push(newQuestion);
        await course.save();

        await notificationModel.create({
            title : `New Questions Asked in ${course.name}`,
            message : `You have a new question asked in ${courseContent.title}`,
            userId : (req as jwtPayloadNew).user._id
        })
        res.status(200).json({
            success: true,
            course
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// add answer in course question

interface iAddAnswerData{
    answer : string;
    courseId : string;
    contentId : string;
    questionId : string;
}

export const addAnswer = catchAsyncError(async(req:Request,res:Response,next:NextFunction) =>{
    try {
        const {answer,courseId,contentId,questionId} : iAddAnswerData = req.body;
        const user = (req as jwtPayloadNew).user;
        const course = await courseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler(`Failed to fetch course in question route`, 400));
        }
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler(`ContentId : ${contentId} is not valid`, 400));
        }
        
        const courseContent = course.courseData.find((a : iCourseData) => a._id.equals(contentId));
        console.log("courseContent : ",courseContent);
        console.log("courseData : ",course.courseData);
        if (courseContent === null || courseContent === undefined) {
            return next(new ErrorHandler(`Failed to find course with contentId : ${contentId}`, 400));
        }
        const courseQuestion = courseContent.questions.find((a:any) => a._id.equals(questionId));
        if (!courseQuestion) {
            return next(new ErrorHandler(`Failed to find Question with QuestionId : ${questionId}`, 400));
        }
        const newAnswer : any = {
            user : user,
            answer,
        }
        courseQuestion.questionReplies?.push(newAnswer);
        await course.save();

        if(user._id === courseQuestion.user._id){
            // if both user id is same, it mean it a reply
            //create a notification
            await notificationModel.create({
                title : `You have a new Reply in this course ${course.name}`,
                message : `You have a new reply in this video ${courseContent.title}`,
                userId : (req as jwtPayloadNew).user._id
            })
            const data = {
                name : courseQuestion.user.name,
                title : courseContent.title
            }
            try {
                await sendMail({
                    email: courseQuestion.user.email,
                    subject:'Question Replies',
                    template:'questionReplies.ejs',
                    data
                })
            } catch (error:any) {
                return next(new ErrorHandler(`Failed to send Email due to this error : ${error.message}`,400));
            }
        }else{
            //send one email
            console.log("Hiiii")
        }
        res.status(200).json({
            success: await success(res.statusCode),
            course
        })

    }catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

//Add reviews in course

interface iReviewData{
    review : string;
    courseId : string;
    rating : number;
    userId : string;
}

export const addReview = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {comment} = req.body;

        const user = (req as jwtPayloadNew).user;
        const courseList = user.courses;
        const courseId = req.params.id;
        const isCourseExist = courseList.find(a=>a.courseId === courseId);
        if(!isCourseExist){
            return next(new ErrorHandler(`You Are Not Allowed to Access This Course Mate`,400));
        }
        const course = await courseModel.findById(courseId);
        if(!course){
            return next(new ErrorHandler(`Error in getting course`,400));
        }
        const reviewData : any = {
            user : user,
            rating : 5.0,
            comment : comment
        }
        course.reviews.push(reviewData);

        let avg = 0.0;
        let count = 0.0;
        course.reviews.forEach((rev:any)=>{
            avg+=rev.rating;
            count+=1.0;
        })
        course.ratings = avg/course.reviews.length;
        await course.save();
        
        const notification = {
            title : "New Review Recieved",
            message : `${user.name} had given review in our course : ${course.name}`,
            userId : (req as jwtPayloadNew).user._id
        }
        await notificationModel.create({
            notification
        });
        res.status(200).json({
            success : true,
            course,notification
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

//Add reply in reviews

interface iReviewReply{
    comment : string;
    courseId : string;
    reviewId : string;
}

export const reviewReply = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {comment,courseId,reviewId} = req.body as iReviewReply;
        const user = (req as jwtPayloadNew).user;
        const course = await courseModel.findById(courseId);
        if(!course){
            return next(new ErrorHandler('failed to fetch course',400));
        }
        const review = course.reviews.find((a:any)=> a._id.equals(reviewId));
        if(!review){
            return next(new ErrorHandler(`Failed to find review with review ID : ${reviewId}`,400));
        }
        const reviewReplyData : any = {
            user,comment
        }
        if(!review.commentReplies){
            review.commentReplies = [];
        }
        review.commentReplies?.push(reviewReplyData);
        await course.save();
        res.status(200).json({
            success : true,
            course
        });

    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//Get all Courses
export const getAllCourse = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        getAllCoursesService(res,next);
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

//Delete Course - admin only

export const deleteCourseById = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        //courseId === _id here
        const {courseId} = req.params;
        console.log(courseId);
        const course = await courseModel.findById(courseId);
        if(!course){
            return next(new ErrorHandler('Course not found',400));
        }
        await course.deleteOne({courseId});
        const coursesMongo = await courseModel.find({}).select("-courseData.videoUrl -courseData.links -courseData.questions -courseData.suggestion -courseData.videoLength -courseData.videoPlayer ");
        await redis?.set('courses', JSON.stringify(coursesMongo));        
        return res.status(200).json({
            success : true,
            message : "Course deleted SuccessFully"
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})

export const generateVideoUrl = catchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
    try {
        const {videoId} = req.body;
        const response = await axios.post(
            `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
            {ttl:300},
            {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
                },
            }
        );
        res.json(response.data)
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})