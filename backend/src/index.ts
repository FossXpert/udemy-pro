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
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:9002",
            "https://3000-idx-udemy-progit-1736352955958.cluster-7ubberrabzh4qqy2g4z7wgxuw2.cloudworkstations.dev/",
            "http://100.93.3.137:3000",
            "http://localhost:3001",
            "https://udemy-p1pe1f8p6-rahul-rays-projects.vercel.app/",
            "https://udemy-49bdjjmlv-rahul-rays-projects.vercel.app/",
        ],
        credentials: true,
    })
);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins (you can restrict this later)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

    cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
        connectDB();
    })

    app.use('/api/user', userRouter);
    app.use('/api/course', courseRouter);
    app.use('/api/order', orderRouter);
    app.use('/api/notification', notificationRouter);
    app.use('/api/analytics', analyticsRouter);
    app.use('/api/layout', layoutRouter);
    app.use('/api/cart', cartRouter);

    app.use(errorMiddleware);

    app.get('/', (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({
            message: "Valid Empty Route",
        })
    })
    app.all('*', (req: Request, res: Response, next: NextFunction) => {
        res.status(404).json({
            message: "Invalid Route",
        })
    })
