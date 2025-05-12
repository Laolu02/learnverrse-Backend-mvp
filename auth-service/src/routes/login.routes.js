import express from 'express';
import { loginLearnerController } from '../controllers/login.controller.js';

const router = express.Router();

router.post('/login-learner', loginLearnerController);

export default router;