import UserModel from '../model/user.model.js';
import AccountModel from '../model/account.model.js';
import { AccountProviderEnum } from '../enums/account-provider.enum.js';
import { UnauthorizedException } from '../utils/appError.js';
import bcrypt from 'bcryptjs';

export const loginLearnerService = async ({ email, password }) => {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify account provider is EMAIL
    const account = await AccountModel.findOne({
      userId: user._id,
      provider: AccountProviderEnum.EMAIL,
      providerId: email,
    });

    if (!account) {
      throw new UnauthorizedException('No email account found for this user');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Successful login
    return { user };
  } catch (error) {
    logger.error('Error logging in user');
    throw error;
  }
};
