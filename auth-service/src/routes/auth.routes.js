import express from 'express';
import { forgotPasswordController } from '../controllers/forgotPassword.controller.js';
import { 
  registerLearnerController,
  registereducatorController,
  googleAuthController,
  googleAuthCallbackController
} from '../controllers/register.controller.js';



const router = express.Router();

router.post('/forgot-password', forgotPasswordController);
router.get('/google', googleAuthController);
router.get('/google/callback', googleAuthCallbackController);
router.post('/register-educator', registereducatorController);
router.post('/register-learner', registerLearnerController);

export default router;

