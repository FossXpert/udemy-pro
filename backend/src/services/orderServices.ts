import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import orderModel from "../models/order";
import { jwtPayloadNew } from "../middlewares/auth";
import courseModel from "../models/course";

export const newOrder = async (data: any,res: Response) => {
    try {
        const order = await orderModel.create(data);
        return res.status(200).json({
            success: true,
            message: `You have successfully bought the course`,
            order
        })
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        })
    }
}
export const getAllOrdersService = async (res: Response,next:NextFunction) => {
    try {
        const allOrders = await orderModel.find().sort({createdAt:-1});
        return res.status(200).json({
            success: true,
            allOrders
        })
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        })
    }
}



