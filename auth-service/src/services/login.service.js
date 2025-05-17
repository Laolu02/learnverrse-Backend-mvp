import UserModel from '../model/user.model.js';
import AccountModel from '../model/account.model.js';
import { UnauthorizedException, NotFoundException, BadRequestException } from '../utils/appError.js';
import { AccountProviderEnum } from '../enums/account-provider.enum.js';

export const loginUserService = async ({ email, password }) => {
  try {
    console.log(email);
    const account = await AccountModel.findOne({
      provider: AccountProviderEnum.EMAIL,
      providerId: email,
    });

    if (!account) {
      throw new NotFoundException('Account does not exist');
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
      throw new BadRequestException('Invalid email or password');
    }
    const userWithoutPassword = user.omitPassword();
    return { user: userWithoutPassword };
  } catch (error) {
    throw error;
  }
};
