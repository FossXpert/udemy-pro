import express from 'express'
import { addAnswer, addQuestion, addReview, deleteBoughtCourseById, deleteCourseById, editCourse, generateVideoUrl, getAllCourse, getAllCourses, getCourseByUser, getSingleCourse, reviewReply, uploadCourse }   from '../controllers/courseController';
import { isAuthenticated, validateUserRole } from '../middlewares/auth';
import { updateAccessToken } from '../controllers/userController';

export const courseRouter = express.Router();

courseRouter.post('/createcourse',updateAccessToken,isAuthenticated,validateUserRole('admin'),uploadCourse);
courseRouter.put('/updatecourse/:id',updateAccessToken,isAuthenticated,validateUserRole('admin'),editCourse);
courseRouter.get('/get-single-course/:id',updateAccessToken,isAuthenticated,getSingleCourse);
courseRouter.get('/getallcourses',getAllCourses);
courseRouter.get('/getallcourse',updateAccessToken,isAuthenticated,validateUserRole('admin'),getAllCourse);// admin wale page par
courseRouter.post('/get-course-content/:id',updateAccessToken,isAuthenticated,getCourseByUser);
courseRouter.delete('/deletecoursebyid/:courseId',updateAccessToken,isAuthenticated,validateUserRole('admin'),deleteCourseById);// admin wale page par
courseRouter.post('/deleteboughtcoursebyid/:courseId',updateAccessToken,isAuthenticated,deleteBoughtCourseById);// user wale page par
// courseRouter.post('/addquestion',updateAccessToken,isAuthenticated,addQuestion);//
// courseRouter.post('/addanswer',updateAccessToken,isAuthenticated,addAnswer);//
// courseRouter.post('/addreview/:id',updateAccessToken,isAuthenticated,addReview);//
// courseRouter.post('/addreviewreply',updateAccessToken,isAuthenticated,validateUserRole('admin'),reviewReply);//
// courseRouter.post('/getvdocipherotp',generateVideoUrl);