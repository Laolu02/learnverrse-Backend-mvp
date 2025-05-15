import passport from "passport";
import express from "express";

import { forgotPasswordController } from "../controllers/forgotPassword.controller.js";
import { resetPasswordController } from "../controllers/resetPassword.controller.js";
import { changePasswordController } from "../controllers/changePassword.controller.js";
import validateResetToken from "../middlewares/validateResetToken.middleware.js";
import {
  registerLearnerController,
  registerEducatorController,
  googleAuthCallbackController,
  loginUserController,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handle callback of Google Auth
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallbackController
);
router.post("/register-educator", registerEducatorController);
router.post("/register-learner", registerLearnerController);
router.post("/login", loginUserController);
//Forgot Password routes
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/change-password", validateResetToken, changePasswordController);

export default router;
