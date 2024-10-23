import { Request,Response,NextFunction } from "express";
import ErrorHandler from "../utills/errorHandlers";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { generateLast12MonthsData } from "../utills/analyticsGenerator";
import { userModel } from "../models/user";
import courseModel from "../models/course";
import orderModel from "../models/order";

//get user analytics -- Only for Admin
export const getUserAnalytics = catchAsyncError(async (req:Request,res:Response,next:NextFunction) => {
    try {
        const users = await generateLast12MonthsData(userModel);
        res.status(200).json({
            success:true,
            users
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})

//get course analytics - admin only

export const getCoursesAnalytics = catchAsyncError(async (req:Request,res:Response,next:NextFunction) => {
    try {
        const courses = await generateLast12MonthsData(courseModel);
        res.status(200).json({
            success:true,
            courses
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})
export const getOrdersAnalytics = catchAsyncError(async (req:Request,res:Response,next:NextFunction) => {
    try {
        const orders = await generateLast12MonthsData(orderModel);
        res.status(200).json({
            success:true,
            orders
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})