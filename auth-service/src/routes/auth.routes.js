import passport from 'passport';
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

import {
    registerLearnerController,
    registerEducatorController,
    googleAuthCallbackController,
    loginUserController,
} from '../controllers/auth.controller.js';


// Start Google OAuth
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handle callback of Google Auth
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    googleAuthCallbackController
);

router.post('/register-educator', registerEducatorController);
router.post('/register-learner', registerLearnerController);
router.post('/login', loginUserController);


export default router;
