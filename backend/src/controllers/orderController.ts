import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utills/errorHandlers";
import orderModel, { iOrder } from "../models/order";
import { jwtPayloadNew } from "../middlewares/auth";
import { userModel } from "../models/user";
import courseModel from "../models/course";
import { getAllOrdersService, newOrder } from "../services/orderServices";
import sendMail from "../utills/sendMail";
import notificationModel from "../models/notification";


export const createOrder = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {courseId,payment_info} = req.body as iOrder;
        
        const user = await userModel.findById((req as jwtPayloadNew).user._id);
        if(!user){
            return next(new ErrorHandler(`errror in getting user`,400));
        }
        //checking if user already purchased this course or not
        const isCourseExist = await user.courses.find(a => a.courseId === courseId );
        if(isCourseExist){
            return next(new ErrorHandler('You have already bought this course',400));
        }
        const course = await courseModel.findById(courseId);
        if(!course){
            return next(new ErrorHandler(`Failed to fetch course`,400));
        }
        const orderData : any = {
                courseId  : course._id,
                userId : user._id,
                payment_info : payment_info
        }       
        console.log('data : ',orderData); 
        user.courses.push({courseId});
        if(course.purchased !== undefined){
            course.purchased+=1;
        }
        await notificationModel.create({
            title : 'New Order Created',
            message : `You have successfully bought ${course.name}`,
            userId : user._id,
            status : 'unread'
        })
        await course.save();
        await user.save();
        await newOrder(orderData,res);
        const order = await orderModel.findOne({userId : user._id}).sort({createdAt : -1});
        if(!order){
            return next(new ErrorHandler('Failed to retrieve latest order mate!',400));
        }
        const emailData : any = {
            order : {
                id : order._id,
                name : course.name,
                price : course.price,
                date : order.createdAt
            }
        }
        await sendMail({
            email : user.email,
            subject : 'Order Confirmation',
            template : `orderCreation.ejs`,
            data : emailData 
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
});

//Get all orders admin ke liye

export const getAllOrders = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        getAllOrdersService(res,next);
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})