"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRouter = void 0;
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const auth_1 = require("../middlewares/auth");
const userController_1 = require("../controllers/userController");
exports.courseRouter = express_1.default.Router();
exports.courseRouter.post('/createcourse', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), courseController_1.uploadCourse);
exports.courseRouter.put('/updatecourse/:id', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), courseController_1.editCourse);
exports.courseRouter.get('/get-single-course/:id', userController_1.updateAccessToken, auth_1.isAuthenticated, courseController_1.getSingleCourse);
exports.courseRouter.get('/getallcourses', courseController_1.getAllCourses);
exports.courseRouter.get('/getallcourse', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), courseController_1.getAllCourse); // admin wale page par
exports.courseRouter.post('/get-course-content/:id', userController_1.updateAccessToken, auth_1.isAuthenticated, courseController_1.getCourseByUser);
exports.courseRouter.delete('/deletecoursebyid/:courseId', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), courseController_1.deleteCourseById); // admin wale page par
// courseRouter.post('/addquestion',updateAccessToken,isAuthenticated,addQuestion);//
// courseRouter.post('/addanswer',updateAccessToken,isAuthenticated,addAnswer);//
// courseRouter.post('/addreview/:id',updateAccessToken,isAuthenticated,addReview);//
// courseRouter.post('/addreviewreply',updateAccessToken,isAuthenticated,validateUserRole('admin'),reviewReply);//
// courseRouter.post('/getvdocipherotp',generateVideoUrl);
