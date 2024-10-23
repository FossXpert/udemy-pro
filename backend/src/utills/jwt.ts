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

const accessTokenExp = parseInt(process.env.ACCESS_EXP_TIME || '300',10);
const refreshTokenExp = parseInt(process.env.REFRESH_EXP_TIME || '1200',10);

export const accessTokenOptions : iTokenOptions = {
        expires : new Date(Date.now() + accessTokenExp *60 *60* 1000),
        httpOnly : true,
        maxAge : accessTokenExp * 60 * 60 * 1000,
        sameSite : 'lax',
}
export const refreshTokenOptions : iTokenOptions = {
        expires : new Date(Date.now() + refreshTokenExp * 60 * 60 * 1000),
        httpOnly : true,
        maxAge : refreshTokenExp *24* 1000 *60 *60 ,
        sameSite : 'lax',
}

export const sendToken = async(user : iUser,statusCode : number,res:Response) => {
    const accessToken =  await user.signAccessToken(); // it has effect
    const refreshToken = await user.signRefreshToken();// 

    console.log(accessToken,refreshToken)

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