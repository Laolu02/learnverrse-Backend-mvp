import { resetPasswordService } from '../services/resetPassword.service.js';
import { resetPasswordSchema } from '../validations/resetPassword.validation.js';
import AsyncHandler from '../middlewares/asyncHandler.js';
import { HTTPSTATUS } from '../configs/http.config.js';

export const resetPasswordController = AsyncHandler(async (req, res) => {
    // Validate the request body
    const { email, token } = resetPasswordSchema.parse(req.body);

    // Call the service
    await resetPasswordService(email, token);

    // Send a cookie with the token
    res.cookie('resetToken', token, {
        httpOnly: true, // Prevent access from JavaScript
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        maxAge: 10 * 60 * 1000, // 10 minutes
    });

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Token is valid',
    });
});