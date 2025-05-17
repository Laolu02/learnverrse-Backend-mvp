import TempTokenModel from '../model/tempToken.model.js';
import { BadRequestException } from '../utils/appError.js';
import argon2 from 'argon2';

const validateResetToken = async (req, res, next) => {
    const { resetToken } = req.cookies;

    if (!resetToken) {
        throw new BadRequestException('Reset token is missing');
    }

    next();
};

export default validateResetToken;