import { Request, Response, NextFunction } from 'express';
import { catchAsyncError, success } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utills/errorHandlers";
import mongoose from 'mongoose';
import courseModel from '../models/course';
import Cart from '../models/cart';
import { jwtPayloadNew } from '../middlewares/auth';

// Add to cart function
export const addToCart = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as jwtPayloadNew).user._id;  // Get user ID from the JWT 
        // console.log(userId);
        const productId = req.body._id;  // Get product ID from request body
        console.log(productId);
        const quantity = req.body.quantity || 1;  // Get quantity (default to 1 if not provided)

        // Find the product (assumes you're adding products from the courseModel)
        const product = await courseModel.findById(productId);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        // Check if the user already has a cart
        let cart:any = await Cart.findOne({ userId: userId });

        // If the user has no cart, create a new one
        if (!cart) {
            cart = new Cart({
                userId: userId,
                items: [{
                    product: productId,
                    quantity: quantity,
                    price: product.price,
                    totalPrice: product.price * quantity
                }],
                subTotal: product.price * quantity
            });
        } else {
            // If cart exists, check if product is already in the cart
            const itemIndex = cart.items.findIndex((item:any) => item.product.equals(productId));

            if (itemIndex > -1) {
                console.log("here")
                // Product exists in the cart, update the quantity and total price
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].totalPrice = cart.items[itemIndex].quantity * cart.items[itemIndex].price;
            } else {
                // Product does not exist in the cart, add it as a new item
                cart.items.push({
                    product: productId,
                    quantity: quantity,
                    price: product.price,
                    totalPrice: product.price * quantity
                });
            }

            // Recalculate the cart subtotal
            cart.subTotal = cart.items.reduce((sum : any, item : any) => sum + item.totalPrice, 0);
        }

        // Save the cart
        await cart.save();

        // Send response
        res.status(200).json({
            success: true,
            cart
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const removeFromCart = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as jwtPayloadNew).user._id;  // Get user ID from the JWT 
        const productId = req.body._id;  // Get product ID from request body

        console.log(productId);
        // Find the user's cart
        let cart : any = await Cart.findOne({ userId: userId });

        if (!cart) {
            return next(new ErrorHandler("Cart not found", 404));
        }

        // Find the index of the item to be removed
        const itemIndex = cart.items.findIndex((item: any) => item.product.equals(productId));

        if (itemIndex === -1) {
            return next(new ErrorHandler("Product not found in cart", 404));
        }

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);

        // Recalculate the subtotal
        cart.subTotal = cart.items.reduce((sum: any, item: any) => sum + item.totalPrice, 0);

        // // If no items remain in the cart, you may want to delete the cart or leave it empty
        // if (cart.items.length === 0) {
        //     await cart.remove();  // Optionally remove the cart if empty
        // } else {
        //     // Save the cart after removal
        //     await cart.save();
        // }
        await cart.save();

        // Send response
        res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            cart
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const getCartStatus = catchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
    try {
        const userId = (req as jwtPayloadNew).user._id;  // Get user ID from the JWT 

        const cart = await Cart.findOne({ userId: userId });

        // If no cart exists, return a message
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "No cart found for this user"
            });
        }

        // If a cart is found, return it
        res.status(200).json({
            success: true,
            cart
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
})
