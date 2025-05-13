import express from 'express';
import { registerLearnerController } from '../controllers/register.controller.js';
import { forgotPasswordController } from '../controllers/forgotPassword.controller.js';
import { resetPasswordController } from '../controllers/resetPassword.controller.js';
import { changePasswordController } from '../controllers/changePassword.controller.js';
import validateResetToken from '../middlewares/validateResetToken.middleware.js';

const router = express.Router();

router.post('/register-learner', registerLearnerController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);
router.post('/change-password', validateResetToken, changePasswordController);

export default router;
