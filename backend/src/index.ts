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

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());


app.use(cors({
    origin: ["http://localhost:3000",
        "https://udemy-pro.vercel.app", "http://100.93.3.137:3000/"], // Add your frontend URL here
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

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
