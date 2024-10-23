import express from 'express';
import { addToCart, getCartStatus, removeFromCart } from '../controllers/cartController';
import { isAuthenticated } from '../middlewares/auth';


const cartRouter = express.Router();

cartRouter.post('/addtocart',isAuthenticated,addToCart);
cartRouter.post('/removefromcart',isAuthenticated,removeFromCart);
cartRouter.get('/getcartstatus',isAuthenticated,getCartStatus);

export default cartRouter;