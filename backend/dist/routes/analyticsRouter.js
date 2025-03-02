"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const analyticsController_1 = require("../controllers/analyticsController");
const userController_1 = require("../controllers/userController");
const analyticsRouter = express_1.default.Router();
analyticsRouter.get('/get-user-analytics', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), analyticsController_1.getUserAnalytics);
analyticsRouter.get('/get-order-analytics', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), analyticsController_1.getOrdersAnalytics);
analyticsRouter.get('/get-course-analytics', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), analyticsController_1.getCoursesAnalytics);
exports.default = analyticsRouter;
