import mongoose, { Document, Schema, Model } from "mongoose";
import { ObjectId } from "mongoose";

// CartItem Interface - represents a single item in the cart
interface CartItem extends Document {
  product: ObjectId;
  quantity: number;
  price: number;
  totalPrice: number;
}

// Main Cart Interface - represents the entire cart
interface Cart extends Document {
  userId: ObjectId;
  items: CartItem[];
  subTotal: number;
  updatedAt: Date;
}

// CartItem Schema - defines the structure for individual items in the cart
const cartItemSchema = new Schema<CartItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'udemy-courses',  // Assuming you have a Product model
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
const cartSchema = new Schema<Cart>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'udemy-users',  // Assuming you have a User model
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
cartSchema.pre<Cart>('save', function (next) {
  const cart = this;

  cart.subTotal = cart.items.reduce((sum, item) => {
    item.totalPrice = item.price * item.quantity;
    return sum + item.totalPrice;
  }, 0);

  next();
});

// Model Definition
const Cart: Model<Cart> = mongoose.model<Cart>('udemy-cart', cartSchema);

export default Cart;
