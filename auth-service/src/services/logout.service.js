import RefreshTokenModel from '../model/refreshToken.model.js';
import { NotFoundException } from '../utils/appError.js';
import logger from '../utils/logger.js';

export const logOutService = async (refreshToken) => {
  try {
    const storedToken = await RefreshTokenModel.findOneAndDelete({
      token: refreshToken,
    });
    if (!storedToken) {
      logger.warn('Invalid refresh token provided');
      throw new NotFoundException('Invalid refresh token');
    }

    logger.info('Refresh token deleted for logout');
    return true;
  } catch (error) {
    logger.error('Error while logging out', error);
    throw error;
  }
};
