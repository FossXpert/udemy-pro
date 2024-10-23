require('dotenv').config();
import {Request,Response,NextFunction} from 'express';
import { catchAsyncError } from './catchAsyncError';
import ErrorHandler from '../utills/errorHandlers';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import redis from '../utills/redis';
import { iUser } from '../models/user';


export interface jwtPayloadNew extends Request{
    user : iUser
}
export const isAuthenticated = catchAsyncError(async(req:Request,res:Response,next:NextFunction) => {

    const access_token = req.cookies.access_token as string;

    if(!access_token){
        return next(new ErrorHandler('Please login to access this resource',400));
    }
    
    const decoded  = jwt.verify(access_token,process.env.ACCESS_TOKEN as string) as JwtPayload;

    if(!decoded){
        return next(new ErrorHandler('access token is not valid',400));
    }

    const user = await redis?.get(decoded.id);

    if(!user){
        return next(new ErrorHandler("user not found",400));
    }

    (req as jwtPayloadNew).user  = JSON.parse(user) // Remember it to how to use custom
    next();
})

export const validateUserRole = (...roles : string[]) => {
    
    const userRole = async(req:Request,res:Response,next:NextFunction) => {
        if(!roles.includes((req as jwtPayloadNew).user.role)){
            return next(new ErrorHandler(`Role ${(req as jwtPayloadNew).user.role} is not allowed to access this resourse`,400))
        }
        next();
    }
    return userRole
}