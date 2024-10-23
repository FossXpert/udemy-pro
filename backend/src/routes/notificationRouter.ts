import express from 'express';
import { isAuthenticated, validateUserRole } from '../middlewares/auth';
import { getNotifications, updateNotification } from '../controllers/notificationController';
import { updateAccessToken } from '../controllers/userController';

const notificationRouter = express.Router();
notificationRouter.post('/getnotification',updateAccessToken,isAuthenticated,validateUserRole('admin'),getNotifications);
notificationRouter.post('/updatenotification',updateAccessToken,isAuthenticated,validateUserRole('admin'),updateNotification);
export default notificationRouter;