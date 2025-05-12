import { HTTPSTATUS } from '../configs/http.config.js';
import AsyncHandler from '../middlewares/asyncHandler.js';
import { registerLearnerService } from '../services/register.service.js';
import { registerSchema } from '../validations/register.validation.js';

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
    });
  }
);