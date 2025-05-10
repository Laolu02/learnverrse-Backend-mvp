import express from 'express';
import { forgotPasswordController } from '../controllers/forgotPassword.controller.js';
import { 
  registerLearnerController,
  googleAuthController,
  googleAuthCallbackController
} from '../controllers/register.controller.js';


const router = express.Router();

router.post('/register-learner', registerLearnerController);
router.post('/forgot-password', forgotPasswordController);
router.get('/google', googleAuthController);
router.get('/google/callback', googleAuthCallbackController);

export default router;
