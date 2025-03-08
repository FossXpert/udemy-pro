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
import mongoose from "mongoose";

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://udemy-pro.vercel.app",
        "http://100.93.3.137:3000/",
        "https://udemy-pro-backend.fossxpert.site",
        "https://udemy-pro-backend.vercel.app",
        "https://udemy-pro-backend-rahul-rays-projects.vercel.app",
        "https://udemy-pro-backend-fossxpert-rahul-rays-projects.vercel.app",
        "https://udemy-pro-rahul-rays-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // Add OPTIONS for preflight
    allowedHeaders: [
        "Content-Type", 
        "Authorization", 
        "X-Requested-With", 
        "Accept", 
        "Origin"
    ],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: true,
}));

app.use(express.json());
app.use(cookieParser());

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

connectDB().then(() => {
    console.log("Server is starting...")
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}).catch((error) => {
    console.error("Server failed to start due to DB connection issue:", error);
});

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
app.get("/db", async (req, res) => {
    const status = mongoose.connection.readyState;
    const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"];

    res.json({
        statusCode: status,
        status: states[status] || "Unknown",
    });
});
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        message: "Invalid Route",
    })
})
