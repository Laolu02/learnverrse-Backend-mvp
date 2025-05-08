import express from 'express';
import { registerLearnerController } from '../controllers/register.controller.js';

const router = express.Router();

router.post('/register-learner', registerLearnerController);
