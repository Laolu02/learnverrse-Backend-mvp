import RefreshTokenModel from '../model/refreshToken.model.js';
import UserModel from '../model/user.model.js';
import { BadRequestException, NotFoundException } from '../utils/appError.js';

export const verifyRefreshTokenService = async (refreshToken) => {
  try {
    const storedToken = await RefreshTokenModel.findOne({
      token: refreshToken,
    });

    if (!storedToken) {
      logger.warn('Invalid refresh token provided');
      throw new BadRequestException('Invalid refresh token');
    }

    if (!storedToken || storedToken.expiresAt < new Date()) {
      logger.warn('Invalid or expired refresh token');
      throw new BadRequestException('Invalid  or expired refresh token');
    }

    const user = await UserModel.findById(storedToken.user);

    if (!user) {
      logger.warn('User does not exist');

      throw new NotFoundException('User does not exist');
    }
    //delete the old refresh token
    await RefreshTokenModel.deleteOne({ _id: storedToken._id });

    return user;
  } catch (error) {
    logger.error('Refresh token error occurred', error);
    throw error;
  }
};
