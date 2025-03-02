"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartStatus = exports.removeFromCart = exports.addToCart = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandlers_1 = __importDefault(require("../utills/errorHandlers"));
const course_1 = __importDefault(require("../models/course"));
const cart_1 = __importDefault(require("../models/cart"));
// Add to cart function
exports.addToCart = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user._id; // Get user ID from the JWT 
        // console.log(userId);
        const productId = req.body._id; // Get product ID from request body
        console.log(productId);
        const quantity = req.body.quantity || 1; // Get quantity (default to 1 if not provided)
        // Find the product (assumes you're adding products from the courseModel)
        const product = await course_1.default.findById(productId);
        if (!product) {
            return next(new errorHandlers_1.default("Product not found", 404));
        }
        // Check if the user already has a cart
        let cart = await cart_1.default.findOne({ userId: userId });
        // If the user has no cart, create a new one
        if (!cart) {
            cart = new cart_1.default({
                userId: userId,
                items: [{
                        product: productId,
                        quantity: quantity,
                        price: product.price,
                        totalPrice: product.price * quantity
                    }],
                subTotal: product.price * quantity
            });
        }
        else {
            // If cart exists, check if product is already in the cart
            const itemIndex = cart.items.findIndex((item) => item.product.equals(productId));
            if (itemIndex > -1) {
                console.log("here");
                // Product exists in the cart, update the quantity and total price
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].totalPrice = cart.items[itemIndex].quantity * cart.items[itemIndex].price;
            }
            else {
                // Product does not exist in the cart, add it as a new item
                cart.items.push({
                    product: productId,
                    quantity: quantity,
                    price: product.price,
                    totalPrice: product.price * quantity
                });
            }
            // Recalculate the cart subtotal
            cart.subTotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
        }
        // Save the cart
        await cart.save();
        // Send response
        res.status(200).json({
            success: true,
            cart
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.removeFromCart = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user._id; // Get user ID from the JWT 
        const productId = req.body._id; // Get product ID from request body
        console.log(productId);
        // Find the user's cart
        let cart = await cart_1.default.findOne({ userId: userId });
        if (!cart) {
            return next(new errorHandlers_1.default("Cart not found", 404));
        }
        // Find the index of the item to be removed
        const itemIndex = cart.items.findIndex((item) => item.product.equals(productId));
        if (itemIndex === -1) {
            return next(new errorHandlers_1.default("Product not found in cart", 404));
        }
        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);
        // Recalculate the subtotal
        cart.subTotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
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
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.getCartStatus = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user._id; // Get user ID from the JWT 
        const cart = await cart_1.default.findOne({ userId: userId });
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
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 500));
    }
});
