import { changePasswordService } from '../services/changePassword.service.js';
import AsyncHandler from '../middlewares/asyncHandler.js';
import { HTTPSTATUS } from '../configs/http.config.js';
import { newPasswordSchema } from '../validations/resetPassword.validation.js';

export const changePasswordController = AsyncHandler(async (req, res) => {
    const { email, newPassword } = newPasswordSchema.parse(req.body);

    // Call the service
    await changePasswordService(email, newPassword);

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Password updated successfully',
    });
});