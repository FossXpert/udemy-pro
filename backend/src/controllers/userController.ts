require('dotenv').config();
import ErrorHandler from "../utills/errorHandlers";
import { catchAsyncError, success } from "../middlewares/catchAsyncError";
import { Request, Response,NextFunction } from "express";
import { iUser, userModel} from "../models/user";
import jwt, { Secret ,JwtPayload} from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';
import sendMail from "../utills/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utills/jwt";
import redis from "../utills/redis";
import { jwtPayloadNew } from "../middlewares/auth";
import { getAllUsersService, getUserById } from "../services/userServices";
import { Console } from "console";
import cloudinary from 'cloudinary'
import { json } from "stream/consumers";

interface iRegistrationBody{
    name : string;
    email : string;
    password : string;
    avatar?:string;
}
export const registrationUser = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {name,email,password}:iRegistrationBody = req.body;
        const isEmailExist = await userModel.findOne({email});
        if(isEmailExist){
            return next(new ErrorHandler('Email already exists',400));
        }
        const user : iRegistrationBody = {
            name,
            email,
            password,
        }

        const activationToken  = await userTokenActivation(user);
        const activationCode = activationToken.activationCode;

        const data = {
            user : {
                name:user.name,
            },
            activationCode
        }
        try {
            await sendMail({
                email:user.email,
                subject:'Account activation',
                template:'activationEmail.ejs',
                data
            })
            res.status(201).json({
                success:true,
                message:'Account activation email has been sent to your email address',
                activationToken: activationToken.token,
            })
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 500));
        }

    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
});

export const userTokenActivation  = async(user:iRegistrationBody) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({
        activationCode,user
    },process.env.JWT_SECRET as Secret,{
        expiresIn : '10h'
    })
    return {activationCode,token}
}

interface iActivationRequest{
    authentication_token: string;
    authentication_code: string;
}
export const activateUser = catchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
    try {
        const {authentication_code,authentication_token} = req.body as iActivationRequest;
        const isTokenValid =  jwt.verify(authentication_token,process.env.JWT_SECRET as Secret)
        if(!isTokenValid){
            return res.status(500).json({
                success : await success(res.statusCode),
                message : "Token Not Valid"
            })
        }
        //Great learning hwre, see how can we typecast accourding to our use but onr hting how otp is coming in user.
        const newUser : {user : iUser,activationCode:string} = isTokenValid as {user : iUser, activationCode:string};
        console.log(newUser)
        console.log(authentication_code,newUser.activationCode)
        if(newUser.activationCode !== authentication_code){
            return next(new ErrorHandler('Invalid Activation Code',400));
        }

        const {email,password,name} = newUser.user;
        const emailExist = await userModel.findOne({email});
        if(emailExist){
            return next(new ErrorHandler('Email already exists',400));
        }

        const user = await userModel.create({
            name,
            email,
            password,
        });
        if(user){
            return res.status(200).json({
                success : await success(res.statusCode),
                message : "User Created SuccessFully"
            })
        }
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})

interface iLoginRequest{
    email:string;
    password:string;
}
export const loginUser = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {email,password} = req.body as iLoginRequest;
        if(!email || !password){
            return next(new ErrorHandler('Email or Password is Empty',400));
        }
        
        const user = await userModel.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorHandler('User not found',400));
        }
 
        const isPasswordMatch : boolean = await user.comparePassword(password);
        if(!isPasswordMatch){
            return next(new ErrorHandler('Incorrect Password',400));
        };
       
        await sendToken(user,200,res);
    }catch(error:any){
        return next(new ErrorHandler(error.message,400));
    }
})

export const logoutUser = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        res.cookie('access_token','',{maxAge:1});
        res.cookie('refresh_token','',{maxAge:1});
        const requestUserID = (req as jwtPayloadNew).user._id
        console.log(requestUserID)
        await redis?.del(requestUserID);
        res.status(200).json({
            success : await success(res.statusCode),
            message : "Logged Out User Successfully",
        })

    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})

export const updateAccessToken = catchAsyncError(async(req:Request,res:Response,next:NextFunction) =>{
    try {
        const refresh_token = await req.cookies.refresh_token as string;
        console.log(req.cookies)
        const decoded = await jwt.verify(refresh_token,process.env.REFRESH_TOKEN as string)  as JwtPayload;
        console.log(`decoded: `,decoded);
        if(!decoded){
            return next(new ErrorHandler("Refresh token expired or not valid",400));
        }

        const session = await redis?.get(decoded.id)

        if(!session){
            return next(new ErrorHandler("Session Expired Please Login again",400));
        }

        const user = await JSON.parse(session);

        const access_token = jwt.sign({id:user._id},process.env.ACCESS_TOKEN as Secret,{expiresIn:'5m'});
        const new_refresh_token = jwt.sign({id:user._id},process.env.REFRESH_TOKEN as Secret,{expiresIn:'3d'} )

        await res.cookie('access_token',access_token,accessTokenOptions);
        await res.cookie("refresh_token",new_refresh_token,refreshTokenOptions);

        await redis?.set(user._id,JSON.stringify(user),"EX",7*24*60*60);
        console.log("token refreshed")
        await next();
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})

export const getUserInfo = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const id = (req as jwtPayloadNew).user._id;
        console.log("get userinfi id",id)
        await getUserById(id,res,next);
    } catch (error: any) {
        return next(new ErrorHandler(error.message,400));
    }
})

interface iSocialBody {
    email:string;
    name:string;
    avatar:string;
    password?:string;
}
//social aUTH
export const socialAuth = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    
    try {
        const  {email,name,avatar} = req.body as iSocialBody;
        console.log(email,name,avatar)
        const user = await userModel.findOne({email});
        if(!user){
            const newUser = await userModel.create({email,name,avatar : {
                url : avatar
            }});
            sendToken(newUser,200,res);
        }else{
            sendToken(user,200,res);
        }
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})

interface iUpdateUserInfo{
    email:string;
    name: string;
}

export const updateUserInfo = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {name} = req.body as iUpdateUserInfo;
        const userId = await (req as jwtPayloadNew).user._id;
        const user = await userModel.findById((req as jwtPayloadNew).user._id);
        // if(user && email){
        //     const isEmailExist = await userModel.findOne({email});
        //     if(isEmailExist){
        //         return next(new ErrorHandler('This Email already exist , try with new email',400));
        //     }
        //     user.email = email;
        // }
        console.log(name)
        if(name && user){
            user.name = name;
        }else{
            return next(new ErrorHandler('user is null or undefined',400));
        }
        await user?.save();
        await redis?.set(userId,JSON.stringify(user));

        res.status(201).json({
            success : await success(res.statusCode),
            user : user
        })
    
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})

interface iUpdatePassword{
    oldPassword : string;
    newPassword : string;
}

export const updatePassword = catchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
    try {
        const {oldPassword,newPassword} = req.body as iUpdatePassword;
        console.log(oldPassword,newPassword);
        const user = await userModel.findById((req as jwtPayloadNew).user._id).select("+password");
        if(!user){
            return next(new ErrorHandler('Sorry! User Not found in UpdatePassword',400));
        }
        const isPasswordMatch = await user.comparePassword(oldPassword);
        if(!isPasswordMatch){
            return next(new ErrorHandler('Sorry! Password Incorrect',400))
        }
        user.password = newPassword;

        await user.save();
        await redis?.set((req as jwtPayloadNew).user._id,JSON.stringify(user));
        res.status(201).json({
            success : await success(res.statusCode),
            user : user
        })
        
    } catch (error: any) {
        return next(new ErrorHandler(error.message,400));
    }
})
interface iUpdateProfilePic{
    avatar : string;
}

export const updateProfilePicture = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        
        const {avatar} = req.body ;

        console.log(req.body)
        const userId = (req as jwtPayloadNew).user._id;
        const user  = await userModel.findById(userId);
        if(!user){
            return next(new ErrorHandler('Sorry user is undefined in updateProfile controller',400));
        }

        if(!avatar){
            return next(new ErrorHandler('Avatar is Empty',400)) ;
        }
        
        if(user.avatar.public_id){
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }
        const myCloud = await cloudinary.v2.uploader.upload(avatar,{
            folders : "avatars",
        });
        user.avatar = {
            public_id : myCloud.public_id,
            url : myCloud.secure_url,
        }   

        await user.save();
        await redis?.set(userId,JSON.stringify(user));
        
        res.status(201).json({
            success : await success(res.statusCode),
            user : user
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})

//get all user for admin
export const getAllUser = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        await getAllUsersService(res,next);
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})

//Updating userROle - only for admin
interface iUpdateuserRole{
     userId : string;
     role : string;
}
export const updateUserRole = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {userId,role} = req.body as iUpdateuserRole;
        const user = await userModel.findByIdAndUpdate(userId,{role},{new:true});
        return res.status(200).json({
            success : true,
            user
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})

//DELETE USER -- FOR ADMIN ONLY
export const deleteUserById = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {userId} = req.params;
        console.log(userId);
        const user = await userModel.findById(userId);
        if(!user){
            return next(new ErrorHandler('User not found',400));
        }
        await user.deleteOne({userId});
        await redis?.del(userId);
        return res.status(200).json({
            success : true,
            message : "User deleted SuccessFully"
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
})
