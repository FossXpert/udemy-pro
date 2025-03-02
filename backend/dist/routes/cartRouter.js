"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const auth_1 = require("../middlewares/auth");
const cartRouter = express_1.default.Router();
cartRouter.post('/addtocart', auth_1.isAuthenticated, cartController_1.addToCart);
cartRouter.post('/removefromcart', auth_1.isAuthenticated, cartController_1.removeFromCart);
cartRouter.get('/getcartstatus', auth_1.isAuthenticated, cartController_1.getCartStatus);
exports.default = cartRouter;
