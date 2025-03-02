"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const notificationController_1 = require("../controllers/notificationController");
const userController_1 = require("../controllers/userController");
const notificationRouter = express_1.default.Router();
notificationRouter.post('/getnotification', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), notificationController_1.getNotifications);
notificationRouter.post('/updatenotification', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), notificationController_1.updateNotification);
exports.default = notificationRouter;
