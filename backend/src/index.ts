require('dotenv').config();
import { app } from "./app";
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import connectDB from "./utills/db";
import errorMiddleware from "./middlewares/error";
import userRouter from "./routes/userRoutes";
import cloudinary from 'cloudinary';
import { courseRouter } from "./routes/courseRoutes";
import orderRouter from "./routes/orderRoutes";
import notificationRouter from "./routes/notificationRouter";
import analyticsRouter from "./routes/analyticsRouter";
import layoutRouter from "./routes/layoutRouter";
import { hostname } from "os";
import { Console } from "console";
import cartRouter from "./routes/cartRouter";
//j
app.use(express.json({limit:'50mb'}));
app.use(cookieParser());
app.use(
    cors({
        origin : [
            "http://localhost:3000",
            "http://100.93.3.137:3000",
            "http://localhost:3001",
            "https://udemy-p1pe1f8p6-rahul-rays-projects.vercel.app/",
            "https://udemy-49bdjjmlv-rahul-rays-projects.vercel.app/",
        ],
        credentials : true,
    })
);


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
    console.log(hostname.name)
    console.log(process.env.PORT)
    console.log('http://localhost:3004')
})

app.use('/api/user',userRouter);
app.use('/api/course',courseRouter);
app.use('/api/order',orderRouter);
app.use('/api/notification',notificationRouter);
app.use('/api/analytics',analyticsRouter);
app.use('/api/layout',layoutRouter);
app.use('/api/cart',cartRouter);

app.use(errorMiddleware);

app.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json({
        message : "Valid Empty Route",
    })
})
app.all('*',(req:Request,res:Response,next:NextFunction)=>{
    res.status(404).json({
        message : "Invalid Route",
    })
})
