import express from 'express';
import { registerLearnerController, registereducatorController } from '../controllers/register.controller.js';

const router = express.Router();

router.post('/register-learner', registerLearnerController);
router.post('/register-educator', registereducatorController);


export default router