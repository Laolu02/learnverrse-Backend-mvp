import UserModel from '../model/user.model.js';
import AccountModel from '../model/account.model.js';
import { UnauthorizedException, NotFoundException } from '../utils/appError.js';

export const loginUserService = async ({ email, password }) => {
  try {
    const account = await AccountModel.findOne({
      provider,
      providerId: email,
      isVerified: true,
    });

    if (!account) {
      throw new NotFoundException('Invalid email or password');
    }
    if (account && account.isVerified === false) {
      throw new UnauthorizedException('Please verify your account');
    }

    const user = await UserModel.findById(account.userId);

    if (!user) {
      throw new NotFoundException('User not found for the given account');
    }

    const isMatch = await user.verifyPassword(password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user.omitPassword();
  } catch (error) {
    throw error;
  }
};
