import crypto from 'crypto';
import UserModel from '../model/user.model.js';
import TempTokenModel from '../model/tempToken.model.js'; // Temporary schema
import logger from '../utils/logger.js';
import { NotFoundException } from '../utils/appError.js';
import argon2 from 'argon2'; // Import argon2 for hashing

export const forgotPasswordService = async (email) => {
    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new NotFoundException('User with this email does not exist');
    }

    // Generate a 6-digit token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the token
    const hashedToken = await argon2.hash(resetToken);

    // Save the hashed token and email to the temporary schema
    await TempTokenModel.create({
        email,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Token expires in 10 minutes
    });

    logger.info(`Password reset token generated for user: ${email}`);

    return { resetToken, email }; // Return the plain token to send to the user
};