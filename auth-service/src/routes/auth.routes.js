import express from 'express';
import { registerLearnerController } from '../controllers/register.controller.js';
import { forgotPasswordController } from '../controllers/forgotPassword.controller.js';

const router = express.Router();


router.post('/register-learner', registerLearnerController);
router.post('/forgot-password', forgotPasswordController);


export default router;
