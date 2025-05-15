import TempTokenModel from '../model/tempToken.model.js';
import { BadRequestException } from '../utils/appError.js';
import argon2 from 'argon2'; // Import argon2 for token comparison

export const resetPasswordService = async (email, token) => {
    // Check if the token exists in the temporary schema
    const tempToken = await TempTokenModel.findOne({ email });
    if (!tempToken) {
        throw new BadRequestException('Invalid or expired token');
    }

    // Check if the token has expired
    if (tempToken.expiresAt < new Date()) {
        throw new BadRequestException('Token has expired');
    }

    // Compare the provided token with the hashed token
    const isTokenValid = await argon2.verify(tempToken.token, token);
    if (!isTokenValid) {
        throw new BadRequestException('Invalid token');
    }

    return true; // Token is valid
};