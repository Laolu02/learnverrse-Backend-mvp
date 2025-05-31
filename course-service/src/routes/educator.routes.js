import express from 'express';
import { viewAllCourses, createCourse, updateCourse, deleteCourse } from '../controllers/educator.controller.js';
import { auth, isEducator } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.get('/courses', auth, viewAllCourses);

router.post('/courses', auth, isEducator, createCourse);

router.put('/courses/:courseId', auth, isEducator, updateCourse);

router.delete('/courses/:courseId', auth, isEducator, deleteCourse);

export default router;

