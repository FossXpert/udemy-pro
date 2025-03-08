"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.updateUserRole = exports.getAllUser = exports.updateProfilePicture = exports.updatePassword = exports.updateUserInfo = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.userTokenActivation = exports.registrationUser = void 0;
require('dotenv').config();
const errorHandlers_1 = __importDefault(require("../utills/errorHandlers"));
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMail_1 = __importDefault(require("../utills/sendMail"));
const jwt_1 = require("../utills/jwt");
const userServices_1 = require("../services/userServices");
const cloudinary_1 = __importDefault(require("cloudinary"));
exports.registrationUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const isEmailExist = await user_1.userModel.findOne({ email });
        if (isEmailExist) {
            return next(new errorHandlers_1.default('Email already exists', 400));
        }
        const user = {
            name,
            email,
            password,
        };
        const activationToken = await (0, exports.userTokenActivation)(user);
        const activationCode = activationToken.activationCode;
        const data = {
            user: {
                name: user.name,
            },
            activationCode
        };
        try {
            await (0, sendMail_1.default)({
                email: user.email,
                subject: 'Account activation',
                template: 'activationEmail.ejs',
                data
            });
            res.status(201).json({
                success: true,
                message: 'Account activation email has been sent to your email address',
                activationToken: activationToken.token,
            });
        }
        catch (error) {
            return next(new errorHandlers_1.default(error.message, 500));
        }
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
const userTokenActivation = async (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({
        activationCode, user
    }, process.env.JWT_SECRET, {
        expiresIn: '10h'
    });
    return { activationCode, token };
};
exports.userTokenActivation = userTokenActivation;
exports.activateUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { authentication_code, authentication_token } = req.body;
        const isTokenValid = jsonwebtoken_1.default.verify(authentication_token, process.env.JWT_SECRET);
        if (!isTokenValid) {
            return res.status(500).json({
                success: await (0, catchAsyncError_1.success)(res.statusCode),
                message: "Token Not Valid"
            });
        }
        //Great learning hwre, see how can we typecast accourding to our use but onr hting how otp is coming in user.
        const newUser = isTokenValid;
        console.log(newUser);
        console.log(authentication_code, newUser.activationCode);
        if (newUser.activationCode !== authentication_code) {
            return next(new errorHandlers_1.default('Invalid Activation Code', 400));
        }
        const { email, password, name } = newUser.user;
        const emailExist = await user_1.userModel.findOne({ email });
        if (emailExist) {
            return next(new errorHandlers_1.default('Email already exists', 400));
        }
        const user = await user_1.userModel.create({
            name,
            email,
            password,
        });
        if (user) {
            return res.status(200).json({
                success: await (0, catchAsyncError_1.success)(res.statusCode),
                message: "User Created SuccessFully"
            });
        }
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.loginUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorHandlers_1.default('Email or Password is Empty', 400));
        }
        const user = await user_1.userModel.findOne({ email }).select("+password");
        if (!user) {
            return next(new errorHandlers_1.default('User not found', 400));
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new errorHandlers_1.default('Incorrect Password', 400));
        }
        ;
        await (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.logoutUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        res.cookie('access_token', '', { maxAge: 1 });
        res.cookie('refresh_token', '', { maxAge: 1 });
        const requestUserID = req.user._id;
        console.log(requestUserID);
        // await redis?.del(requestUserID);
        res.status(200).json({
            success: await (0, catchAsyncError_1.success)(res.statusCode),
            message: "Logged Out User Successfully",
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.updateAccessToken = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const refresh_token = await req.cookies.refresh_token;
        console.log(req.cookies);
        const decoded = await jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
        console.log(`decoded: `, decoded);
        if (!decoded) {
            return next(new errorHandlers_1.default("Refresh token expired or not valid", 400));
        }
        const session = await user_1.userModel.findById(decoded.id);
        if (!session) {
            return next(new errorHandlers_1.default("Session Expired Please Login again", 400));
        }
        const user = session;
        const access_token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: '5m' });
        const new_refresh_token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, { expiresIn: '3d' });
        await res.cookie('access_token', access_token, jwt_1.accessTokenOptions);
        await res.cookie("refresh_token", new_refresh_token, jwt_1.refreshTokenOptions);
        console.log("token refreshed");
        await next();
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.getUserInfo = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const id = req.user._id;
        console.log("get userinfi id", id);
        await (0, userServices_1.getUserById)(id, res, next);
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
//social aUTH
exports.socialAuth = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { email, name, avatar } = req.body;
        console.log(email, name, avatar);
        const user = await user_1.userModel.findOne({ email });
        if (!user) {
            const newUser = await user_1.userModel.create({ email, name, avatar: {
                    url: avatar
                } });
            (0, jwt_1.sendToken)(newUser, 200, res);
        }
        else {
            (0, jwt_1.sendToken)(user, 200, res);
        }
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.updateUserInfo = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { name } = req.body;
        const userId = await req.user._id;
        const user = await user_1.userModel.findById(req.user._id);
        // if(user && email){
        //     const isEmailExist = await userModel.findOne({email});
        //     if(isEmailExist){
        //         return next(new ErrorHandler('This Email already exist , try with new email',400));
        //     }
        //     user.email = email;
        // }
        console.log(name);
        if (name && user) {
            user.name = name;
        }
        else {
            return next(new errorHandlers_1.default('user is null or undefined', 400));
        }
        await user?.save();
        res.status(201).json({
            success: await (0, catchAsyncError_1.success)(res.statusCode),
            user: user
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.updatePassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        console.log(oldPassword, newPassword);
        const user = await user_1.userModel.findById(req.user._id).select("+password");
        if (!user) {
            return next(new errorHandlers_1.default('Sorry! User Not found in UpdatePassword', 400));
        }
        const isPasswordMatch = await user.comparePassword(oldPassword);
        if (!isPasswordMatch) {
            return next(new errorHandlers_1.default('Sorry! Password Incorrect', 400));
        }
        user.password = newPassword;
        await user.save();
        res.status(201).json({
            success: await (0, catchAsyncError_1.success)(res.statusCode),
            user: user
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.updateProfilePicture = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { avatar } = req.body;
        console.log(req.body);
        const userId = req.user._id;
        const user = await user_1.userModel.findById(userId);
        if (!user) {
            return next(new errorHandlers_1.default('Sorry user is undefined in updateProfile controller', 400));
        }
        if (!avatar) {
            return next(new errorHandlers_1.default('Avatar is Empty', 400));
        }
        if (user.avatar.public_id) {
            await cloudinary_1.default.v2.uploader.destroy(user.avatar.public_id);
        }
        const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
            folders: "avatars",
        });
        user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
        await user.save();
        res.status(201).json({
            success: await (0, catchAsyncError_1.success)(res.statusCode),
            user: user
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
//get all user for admin
exports.getAllUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        await (0, userServices_1.getAllUsersService)(res, next);
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.updateUserRole = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { userId, role } = req.body;
        const user = await user_1.userModel.findByIdAndUpdate(userId, { role }, { new: true });
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
//DELETE USER -- FOR ADMIN ONLY
exports.deleteUserById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        const user = await user_1.userModel.findById(userId);
        if (!user) {
            return next(new errorHandlers_1.default('User not found', 400));
        }
        await user.deleteOne({ userId });
        return res.status(200).json({
            success: true,
            message: "User deleted SuccessFully"
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
