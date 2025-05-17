import { HTTPSTATUS } from '../configs/http.config.js';
import AsyncHandler from '../middlewares/asyncHandler.js';
import {
  registerLearnerService,
  registerEducatorService,
} from '../services/register.service.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from '../validations/auth.validation.js';

import generateJwt from '../utils/generateJwt.js';
import { loginUserService } from '../services/login.service.js';
import { sendOtpEmail } from '../utils/sendOtpEmail.js';
import logger from '../utils/logger.js';
import { otpSchema } from '../validations/otp.validations.js';
import { verifyRefreshTokenService } from '../services/verify-refresh-token.service.js';
import { logOutService } from '../services/logout.service.js';
import { verifyRegisterService } from '../services/verify-registration.service.js';
import { forgotPasswordService } from '../services/forgot-password.service.js';
import { verifyOtp } from '../utils/verifyOtp.js';
import { verifyForgotPasswordService } from '../services/verify-forgot-password.service.js';
import { setPasswordSchema } from '../validations/set-password.validations.js';
import { setPasswordService } from '../services/set-password.service.js';

// Regular registration controller
export const registerLearnerController = AsyncHandler(
  async (req, res, next) => {
    // verify the user inputs using Zod register schema

    const body = registerSchema.parse({ ...req.body });

    // call the register service. it take the verified body as argument

    const user = await registerLearnerService(body);
    console.log('user here');
    console.log(user);

    //  send OTP to user email

    await sendOtpEmail(user);
    logger.info('Register Otp sent successfully');

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

    await sendOtpEmail(user);
    logger.info('Register Otp sent successfully');

    return res.status(HTTPSTATUS.CREATED).json({
      message: 'user registered successfully',
      success: true,
    });
  }
);

export const verifyRegisterController = AsyncHandler(async (req, res, next) => {
  const body = otpSchema.parse({ ...req.body });

  await verifyRegisterService(body);

  return res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'verification successful',
  });
});
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

// login user (Learner or Educator)
export const loginUserController = AsyncHandler(async (req, res, next) => {
  //Validate
  const credentials = loginSchema.parse({ ...req.body });

  //Fetch & verify
  const { user } = await loginUserService(credentials);

  console.log(user);

  //generate JWT

  const { accessToken, refreshToken } = await generateJwt(user);

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
      data: user,
      token: accessToken,
    });
});

export const refreshTokenController = AsyncHandler(async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    logger.warn('Refresh token missing');
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      message: 'Refresh token missing',
    });
  }
  const token = cookies.jwt;
  const user = await verifyRefreshTokenService(token);

  if (!user) {
    logger.warn(`Cannot get refresh token`);
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      message: ' Cannot verify token, kindly log in again',
    });
  }
  logger.info('Refresh token verified ');
  // generate new tokens for user
  const { accessToken, refreshToken } = await generateJwt(user);

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
      token: accessToken,
    });
});

export const logoutController = AsyncHandler(async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    logger.warn('Refresh token missing');
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      message: 'Refresh token missing',
    });
  }
  const token = cookies.jwt;

  await logOutService(token);

  return res
    .status(HTTPSTATUS.OK)
    .clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    .json({
      success: true,
      message: 'Logged out successfully!',
    });
});

export const forgotPasswordController = AsyncHandler(async (req, res, next) => {
  const body = forgotPasswordSchema.parse({ ...req.body });

  const user = await forgotPasswordService(body);

  await sendOtpEmail(user);
  logger.info('Password reset OTP sent!');

  return res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'Password reset OTP sent!, check you email',
  });
});

export const verifyForgotPasswordController = AsyncHandler(
  async (req, res, next) => {
    const body = otpSchema.parse({ ...req.body });

    const user = await verifyForgotPasswordService(body);

    if (!user) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        success: false,
        message: ' cannot verify OTP or User does not exist',
      });
    }

    const { accessToken } = await generateJwt(user);
    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: 'OTP code verified',
      passwordResetToken: accessToken,
    });
  }
);

export const setPasswordController = AsyncHandler(async (req, res, next) => {
  const body = setPasswordSchema.parse({ ...req.body });

  const user = await setPasswordService(body);

  if (!user) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      message: 'set new password failed',
    });
  }

  return res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: 'Password set successfully',
  });
});
