import {Request,Response,NextFunction} from 'express';
import { catchAsyncError, success } from '../middlewares/catchAsyncError';
import ErrorHandler from '../utills/errorHandlers';
import courseModel, { iCourse } from '../models/course';
import { jwtPayloadNew } from '../middlewares/auth';
import { userModel } from '../models/user';
import categoryModel from '../models/category';
import redis from '../utills/redis';


export const createCourse = async(data:iCourse,req:Request,res:Response,next:NextFunction)=>{
    try {
        const course = await courseModel.create(data);
        const categoryName : string = "ML";
        const cat = await categoryModel.findOne({'categories.categoryName':categoryName});
        const user = (req as jwtPayloadNew).user;
        const userId = user._id;
        const userData = await userModel.findById(userId);
        if(userData){
            userData.postedCourse?.push(course._id);
            await userData.save();
        }
        course.postedBy = {
            userId : userData?._id,
            name : userData?.name as string,
            email: userData?.email as string
        }
        if(cat){
            course.courseCategory = cat._id;
            const category = cat.categories.find(a=> a.categoryName === categoryName);
            if(category){
                category.containedCourses?.push(course._id);
            }
            await cat.save();
        }else{
            return next(new ErrorHandler('Cat Is Undefined',400));
        }
        await course.save();

        const coursesMongo = await courseModel.find({}).select("-courseData.videoUrl -courseData.links -courseData.questions -courseData.suggestion -courseData.videoLength -courseData.videoPlayer ");
        await redis?.set('courses', JSON.stringify(coursesMongo));
         res.status(201).json({
            success: await success(res.statusCode),
            course
         });
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
};
export const getAllCoursesService = async(res:Response,next:NextFunction)=>{
    try {
        const Allcourses = await courseModel.find().sort({createdAt:-1});
        res.status(200).json({
            Allcourses
        })
    } catch (error:any) {
        throw error
    }
}