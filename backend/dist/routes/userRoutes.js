"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const userRouter = express_1.default.Router();
userRouter.post('/registration', userController_1.registrationUser);
userRouter.post('/verify', userController_1.activateUser);
userRouter.post('/login', userController_1.loginUser);
userRouter.get('/logout', userController_1.updateAccessToken, auth_1.isAuthenticated, userController_1.logoutUser);
userRouter.get('/refreshtoken', userController_1.updateAccessToken);
userRouter.get('/me', userController_1.updateAccessToken, auth_1.isAuthenticated, userController_1.getUserInfo);
userRouter.post('/socialAuth', userController_1.socialAuth);
userRouter.put('/updateuser', userController_1.updateAccessToken, auth_1.isAuthenticated, userController_1.updateUserInfo);
userRouter.put('/updatepassword', userController_1.updateAccessToken, auth_1.isAuthenticated, userController_1.updatePassword);
userRouter.put('/updateprofilepic', userController_1.updateAccessToken, auth_1.isAuthenticated, userController_1.updateProfilePicture);
userRouter.get('/getalluser', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), userController_1.getAllUser);
userRouter.post('/changerole', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), userController_1.updateUserRole);
userRouter.post('/deleteuser/:userId', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), userController_1.deleteUserById);
userRouter.post('/deleteboughtcoursebyid', userController_1.updateAccessToken, auth_1.isAuthenticated, userController_1.deleteBoughtCourseById);
exports.default = userRouter;
