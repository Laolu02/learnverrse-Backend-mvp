import { HTTPSTATUS } from '../configs/http.config.js';
import AsyncHandler from '../middlewares/asyncHandler.js';
import { forgotPasswordService } from '../services/forgotPassword.service.js';
import { resetPasswordSchema } from '../validations/register.validation.js';
import { sendEmail } from '../utils/sendEmail.js';

export const forgotPasswordController = AsyncHandler(async (req, res, next) => {
    // Validate the email
    const { email } = resetPasswordSchema.parse(req.body);

    // Call the service to handle the logic
    const { resetToken } = await forgotPasswordService(email);

    // Send the reset token via email
    const resetUrl = `${process.env.FRONTEND_ORIGIN}/reset-password?token=${resetToken}`;
    await sendEmail(
        email,
        'Password Reset Request',
        `You requested a password reset. Click the link to reset your password: ${resetUrl}`
    );

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Password reset email sent successfully',
    });
});
