import UserModel from '../model/user.model.js';
import TempTokenModel from '../model/tempToken.model.js';
import { BadRequestException } from '../utils/appError.js';
import argon2 from 'argon2';

export const changePasswordService = async (email, newPassword) => {
    // Check if the email exists in the temporary schema
    const tempToken = await TempTokenModel.findOne({ email });
    if (!tempToken) {
        throw new BadRequestException('Invalid request');
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update the user's password
    await UserModel.updateOne({ email }, { password: hashedPassword });

    // Remove the temporary token
    await TempTokenModel.deleteOne({ email });

    return true;
};