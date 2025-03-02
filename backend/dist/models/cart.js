"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// CartItem Schema - defines the structure for individual items in the cart
const cartItemSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'udemy-courses', // Assuming you have a Product model
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    }
});
// Main Cart Schema - defines the structure for the entire cart
const cartSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'udemy-users', // Assuming you have a User model
        required: true,
    },
    items: [cartItemSchema],
    subTotal: {
        type: Number,
        required: true,
        default: 0,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});
// Middleware: Calculate the total price for each item and update the subtotal before saving
cartSchema.pre('save', function (next) {
    const cart = this;
    cart.subTotal = cart.items.reduce((sum, item) => {
        item.totalPrice = item.price * item.quantity;
        return sum + item.totalPrice;
    }, 0);
    next();
});
// Model Definition
const Cart = mongoose_1.default.model('udemy-cart', cartSchema);
exports.default = Cart;
