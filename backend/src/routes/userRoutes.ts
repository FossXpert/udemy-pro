import express from 'express';
import {activateUser, deleteUserById, getAllUser, getUserInfo, loginUser, logoutUser, registrationUser,
    socialAuth, updateAccessToken, updatePassword, updateProfilePicture, updateUserInfo,
    updateUserRole} from '../controllers/userController';
import { isAuthenticated, validateUserRole } from '../middlewares/auth';

const userRouter = express.Router();

userRouter.post('/registration',registrationUser);
userRouter.post('/verify',activateUser);
userRouter.post('/login',loginUser);
userRouter.get('/logout',updateAccessToken,isAuthenticated,logoutUser);
userRouter.get('/refreshtoken',updateAccessToken);
userRouter.get('/me',updateAccessToken,isAuthenticated,getUserInfo);
userRouter.post('/socialAuth',socialAuth);
userRouter.put('/updateuser',updateAccessToken,isAuthenticated,updateUserInfo);
userRouter.put('/updatepassword',updateAccessToken,isAuthenticated,updatePassword);
userRouter.put('/updateprofilepic',updateAccessToken,isAuthenticated,updateProfilePicture);
userRouter.get('/getalluser',updateAccessToken,isAuthenticated,validateUserRole('admin'),getAllUser);
userRouter.post('/changerole',updateAccessToken,isAuthenticated,validateUserRole('admin'),updateUserRole);
userRouter.post('/deleteuser/:userId',updateAccessToken,isAuthenticated,validateUserRole('admin'),deleteUserById);



export default userRouter;