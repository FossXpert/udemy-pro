import express from 'express'
import { addAnswer, addQuestion, addReview, deleteCourseById, editCourse, generateVideoUrl, getAllCourse, getAllCourses, getCourseByUser, getSingleCourse, reviewReply, uploadCourse } from '../controllers/courseController';
import { isAuthenticated, validateUserRole } from '../middlewares/auth';
import { updateAccessToken } from '../controllers/userController';

export const courseRouter = express.Router();

courseRouter.post('/createcourse',updateAccessToken,isAuthenticated,validateUserRole('admin'),uploadCourse);
courseRouter.put('/updatecourse/:id',updateAccessToken,isAuthenticated,validateUserRole('admin'),editCourse);
courseRouter.get('/get-single-course/:id',updateAccessToken,isAuthenticated,getSingleCourse);
courseRouter.get('/getallcourses',getAllCourses);
courseRouter.post('/get-course-content/:id',updateAccessToken,isAuthenticated,getCourseByUser);
courseRouter.post('/addquestion',updateAccessToken,isAuthenticated,addQuestion);
courseRouter.post('/addanswer',updateAccessToken,isAuthenticated,addAnswer);
courseRouter.post('/addreview/:id',updateAccessToken,isAuthenticated,addReview);
courseRouter.post('/addreviewreply',updateAccessToken,isAuthenticated,validateUserRole('admin'),reviewReply);
courseRouter.get('/getallcourse',updateAccessToken,isAuthenticated,validateUserRole('admin'),getAllCourse);
courseRouter.delete('/deletecoursebyid/:courseId',updateAccessToken,isAuthenticated,validateUserRole('admin'),deleteCourseById);
courseRouter.post('/getvdocipherotp',generateVideoUrl);