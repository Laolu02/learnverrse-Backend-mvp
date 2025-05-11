import { HTTPSTATUS } from '../configs/http.config.js';
import AsyncHandler from '../middlewares/asyncHandler.js';
import {
  registerLearnerService,
  registerEducatorService,
} from '../services/register.service.js';
import { registerSchema } from '../validations/auth.validation.js';

import generateJwt from '../utils/generateJwt.js';

// Regular registration controller
export const registerLearnerController = AsyncHandler(
  async (req, res, next) => {
    // verify the user inputs using Zod register schema

    const body = registerSchema.parse({ ...req.body });

    // call the register service. it take the verified body as argument

    const user = await registerLearnerService(body);

    // send OTP verification here
    /* 
    this will be implemented later 
    */
    // send OTP verification here

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: 'User registered successfully',
    });
  }
);

export const registerEducatorController = AsyncHandler(
  async (req, res, next) => {
    const body = registerSchema.parse({ ...req.body });

    const user = await registerEducatorService(body);
    return res.status(HTTPSTATUS.CREATED).json({
      message: 'Account created successfully',
      success: true,
    });
  }
);

// Google registration/ login callback controller

export const googleAuthCallbackController = AsyncHandler(
  async (req, res, next) => {
    const user = req.user;
    const { accessToken, refreshToken } = await generateJwt(user);

    if (!user) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    return res
      .status(HTTPSTATUS.OK)
      .cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .json({
        success: true,
        message: 'Signed in  successfully',
        token: accessToken,
      });
  }
);
