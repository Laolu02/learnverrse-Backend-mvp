import express from 'express';
import { forgotPasswordController } from '../controllers/forgotPassword.controller.js';
import {
  registerLearnerController,
  registereducatorController,
  googleAuthController,
  googleAuthCallbackController,
} from '../controllers/register.controller.js';

const router = express.Router();

// Start Google OAuth

router.get('/google', googleAuthController);

// Handle callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleAuthCallbackController
);

router.post('/forgot-password', forgotPasswordController);

router.post('/register-educator', registereducatorController);
router.post('/register-learner', registerLearnerController);

export default router;
