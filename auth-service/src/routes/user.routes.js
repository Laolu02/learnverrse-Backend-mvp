import express from 'express';
import passport from 'passport';
import { getUserByIdController } from '../controllers/user.controller.js';

const router = express.Router();

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  getUserByIdController
);

export default router;
