import { HTTPSTATUS } from '../configs/http.config.js';
import AsyncHandler from '../middlewares/asyncHandler.js';
import { forgotPasswordService } from '../services/forgotPassword.service.js';
import { sendEmail } from '../utils/sendEmail.js';


export const forgotPasswordController = AsyncHandler(async (req, res) => {
    const { email } = req.body;

    // Call the service
    const { resetToken } = await forgotPasswordService(email);

    // Send the reset token via email
    await sendEmail(
        email,
        'Password Reset Request',
        `Your password reset token is: ${resetToken}`
    );

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Password reset token sent successfully',
    });
});
