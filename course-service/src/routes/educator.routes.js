import express from 'express';
import { viewAllCourses, createCourse } from '../controllers/educator.controller.js';
import { auth, isEducator } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.get('/courses', auth, viewAllCourses);

router.post('/courses', auth, isEducator, createCourse);

export default router;

