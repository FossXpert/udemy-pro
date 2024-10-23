import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utills/errorHandlers";

const errorMiddleware = (err:any,req:Request,res:Response,next:NextFunction) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || 'Internal server error'

    //Wrong Mongodb Error
    if(err.name === 'CastError'){
        const message = `Resource Not Found. Invalid : ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    }

    if(err.name === 'JsonWebTokenError'){
        const message = 'Json Webtoken is invalid, try again';
        err = new ErrorHandler(message,400);
    }

    if(err.name === 'TokenExpiredError'){
        const message = 'Json Webtoken is Expired, try again';
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success : false, 
        message : err.message,

    })

}

export default errorMiddleware;