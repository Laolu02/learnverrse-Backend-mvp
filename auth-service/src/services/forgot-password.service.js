import { AccountProviderEnum } from '../enums/account-provider.enum.js';
import AccountModel from '../model/account.model.js';
import UserModel from '../model/user.model.js';
import { NotFoundException } from '../utils/appError.js';

export const forgotPasswordService = async (body) => {
  const { email } = body;
  try {
    const account = await AccountModel.findOne({
      provider: AccountProviderEnum.EMAIL,
      providerId: email,
    });

    if (!account) {
      throw new NotFoundException(
        'Account does not exist Or cannot reset password for this account'
      );
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  } catch (error) {
    throw error;
  }
};
