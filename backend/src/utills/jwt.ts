require('dotenv').config();
import {Response} from 'express';
import { iUser } from '../models/user';
import redis from './redis';


export interface iTokenOptions{
    expires : Date;
    httpOnly : boolean;
    maxAge : number;
    sameSite: 'none' | 'strict' | 'lax' | undefined;
    secure? : boolean;
}

// Convert expiration time correctly (Assuming process.env values are in minutes)
const accessTokenExp = parseInt(process.env.ACCESS_EXP_TIME || '300', 10) * 60 * 1000; // Convert minutes to milliseconds
const refreshTokenExp = parseInt(process.env.REFRESH_EXP_TIME || '1200', 10) * 60 * 1000; // Convert minutes to milliseconds

export const accessTokenOptions: iTokenOptions = {
    expires: new Date(Date.now() + accessTokenExp),
    httpOnly: true,
    maxAge: accessTokenExp, // Should be in milliseconds
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production' // Set secure flag in production only
};

export const refreshTokenOptions: iTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExp),
    httpOnly: true,
    maxAge: refreshTokenExp, // Should be in milliseconds
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production' // Set secure flag in production only
};

export const sendToken = async(user : iUser,statusCode : number,res:Response) => {
    const accessToken =  await user.signAccessToken(); // it has effect
    const refreshToken = await user.signRefreshToken();// 

    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    //upload session to redis
    redis?.set(user._id,JSON.stringify(user) as any);

    if(process.env.NODE_ENV=='production'){
        accessTokenOptions.secure = true;
        refreshTokenOptions.secure = true;
    }
    res.cookie('access_token',accessToken,accessTokenOptions);
    res.cookie('refresh_token',refreshToken,refreshTokenOptions);

    res.status(statusCode).json({
        success : true,
        user,
        accessToken,
        refreshToken,
    });
}