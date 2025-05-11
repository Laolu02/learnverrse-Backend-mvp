import { HTTPSTATUS } from '../configs/http.config.js';
import AsyncHandler from '../middlewares/asyncHandler.js';
import { registerLearnerService, registerEducatorService } from '../services/register.service.js';
import { registerSchema } from '../validations/register.validation.js';
import passport from 'passport';
import { handleGoogleAuth } from '../services/google-auth.service.js';

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

    return res.status(HTTPSTATUS.CREATED).json({
      success: true,
      message: 'User created Successfully',
  
export const registereducatorController = AsyncHandler(
  async(req,res,next)=>{
    const body = registerSchema.parse({...req.body})

    const user = await registerEducatorService(body);
    //await user.save();
    return res.status(HTTPSTATUS.CREATED).json({
      message: 'Account created successfully',
      success: true,
    });
  }
);


// Google registration controllers
export const googleAuthController = passport.authenticate('google', {
  scope: ['profile', 'email']
});

export const googleAuthCallbackController = AsyncHandler(async (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, profile) => {
    try {
      if (err) {
        return next(err);
      }

      if (!profile) {
        return res.status(HTTPSTATUS.UNAUTHORIZED).json({
          success: false,
          message: 'Google authentication failed'
        });
      }

      const authResult = await handleGoogleAuth(profile);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', authResult.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Google authentication successful',
        user: authResult.user,
        accessToken: authResult.accessToken
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

