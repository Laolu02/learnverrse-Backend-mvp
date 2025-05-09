import express from 'express';
import { 
  registerLearnerController,
  googleAuthController,
  googleAuthCallbackController
} from '../controllers/register.controller.js';

const router = express.Router();

router.post('/register-learner', registerLearnerController);
router.get('/google', googleAuthController);
router.get('/google/callback', googleAuthCallbackController);

export {router}