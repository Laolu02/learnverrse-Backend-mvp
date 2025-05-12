import passport from 'passport';
import express from 'express';
import {
  registerLearnerController,
  registerEducatorController,
  googleAuthCallbackController,
  loginUserController,
} from '../controllers/auth.controller.js';

const router = express.Router();

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
