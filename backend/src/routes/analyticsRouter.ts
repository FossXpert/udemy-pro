import express from 'express';
import { isAuthenticated, validateUserRole } from '../middlewares/auth';
import { getCoursesAnalytics, getOrdersAnalytics, getUserAnalytics } from '../controllers/analyticsController';
import { updateAccessToken } from '../controllers/userController';
const analyticsRouter = express.Router();

analyticsRouter.get('/get-user-analytics',updateAccessToken,isAuthenticated,validateUserRole('admin'),getUserAnalytics);
analyticsRouter.get('/get-order-analytics',updateAccessToken,isAuthenticated,validateUserRole('admin'),getOrdersAnalytics);
analyticsRouter.get('/get-course-analytics',updateAccessToken,isAuthenticated,validateUserRole('admin'),getCoursesAnalytics);

export default analyticsRouter;