
import express, { Router } from "express";
import { isAuthenticated, validateUserRole } from "../middlewares/auth";
import { createOrder, getAllOrders } from "../controllers/orderController";
import { updateAccessToken } from "../controllers/userController";

const orderRouter = express.Router();

orderRouter.post('/createorder',updateAccessToken,isAuthenticated,createOrder);
orderRouter.post('/getallorder',updateAccessToken,isAuthenticated,validateUserRole('admin'),getAllOrders);

export default orderRouter;