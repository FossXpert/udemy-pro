
//get user by id

import { NextFunction, Response } from "express";
import { success } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utills/errorHandlers";
import redis from "../utills/redis";
import { userModel } from "../models/user";

export const getUserById = async(id: string,res:Response,next: NextFunction) => {
    try {
        const user = await redis?.get(id);
        if(!user){
            return next(new ErrorHandler('Failed to retrieve user by ID',400)); 
        }
        const JsonUser = JSON.parse(user);
        return res.status(200).json({
            success : await success(res.statusCode),user:JsonUser,
        })

    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
}

//Get all users

export const getAllUsersService = async(res:Response,next:NextFunction)=>{
    try {
        const users = await userModel.find().sort({createdAt:-1});
        res.status(200).json({
            status : true,
            users
        })
    } catch (error:any) {
        throw error.message
    }
}