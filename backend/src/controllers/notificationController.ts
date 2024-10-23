import { catchAsyncError, success } from "../middlewares/catchAsyncError";
import { Request,Response,NextFunction } from "express";
import ErrorHandler from "../utills/errorHandlers";
import cron from 'node-cron'
import notificationModel from "../models/notification";

//get all notification --- only for admin
export const getNotifications = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const notification = await notificationModel.find().sort({createdAt : -1});
        res.status(200).json({
            success:true,
            notification
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})

// Update notification Status : Only for admin
export const updateNotification = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {notificationId} = req.body;
        const notification = await notificationModel.findById(notificationId);
        if(!notification){
            return next(new ErrorHandler(`Notification with notification id ${notificationId} not found\n`,400));
        }
        notification.status = 'read';
        await notification.save();
        //To see read notification in fronend fetch latest,notification
        const notifications = await notificationModel.find().sort({createdAt:-1});
        return res.status(200).json({
            status : true,
            NotificationStatus : notification.status,
            updatedNotifications : notifications 
        })

    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
});

//delete Notification-ONLY ADMIN
cron.schedule("0 0 0 * * *",async()=>{
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await notificationModel.deleteMany({status:'read',createdAt:{$lt:thirtyDaysAgo}});
    console.log('Deleted read Notification')
})
