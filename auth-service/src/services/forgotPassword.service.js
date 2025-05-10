import crypto from 'crypto';
import UserModel from '../model/user.model.js';
import logger from '../utils/logger.js';
import { BadRequestException, NotFoundException } from '../utils/appError.js';

export const forgotPasswordService = async (email) => {
    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new NotFoundException('User with this email does not exist');
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour

    // Save the token and expiry to the user's record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    logger.info(`Password reset token generated for user: ${email}`);

    return { resetToken, email };
};