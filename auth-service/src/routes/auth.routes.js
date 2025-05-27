import passport from 'passport';
import express from 'express';

import {
  registerLearnerController,
  registerEducatorController,
  googleAuthCallbackController,
  loginUserController,
  refreshTokenController,
  logoutController,
  verifyRegisterController,
  forgotPasswordController,
  verifyForgotPasswordController,
  setPasswordController,
} from '../controllers/auth.controller.js';
import { HTTPSTATUS } from '../configs/http.config.js';

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
router.post('/verify-registration', verifyRegisterController);
router.post('/login', loginUserController);
router.get('/refresh', refreshTokenController);
router.post('/logout', logoutController);
router.post('/forgot-password', forgotPasswordController);
router.post('/verify-reset-password', verifyForgotPasswordController);
router.post(
  '/set-password',
  passport.authenticate('jwt', { session: false }),
  setPasswordController
);

router.get(
  '/current-user',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: 'Access granted to protected route!',
      data: req.user,
    });
  }
);

export default router;
