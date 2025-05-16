import { AccountProviderEnum } from '../enums/account-provider.enum.js';
import { UserRoleEnum } from '../enums/user-role.enum.js';
import AccountModel from '../model/account.model.js';
import UserModel from '../model/user.model.js';
import { BadRequestException } from '../utils/appError.js';
import logger from '../utils/logger.js';

export const registerLearnerService = async (body) => {
  const { email, firstName, lastName, password } = body;

  try {
    const isExisting = await UserModel.findOne({ email });
    if (isExisting) {
      throw new BadRequestException('User already exist');
    }

    const user = new UserModel({
      email,
      password,
      firstName,
      lastName,
      role: UserRoleEnum.LEARNER,
      isRoleVerified: true,
    });

    await user.save();

    /* 
    create an account for the user,

    since the user register using email, the provider will be EMAIL
    the providerId  will be the user email address
    */
    const account = new AccountModel({
      userId: user._id,
      provider: AccountProviderEnum.EMAIL,
      providerId: email,
    });

    await account.save();

    return user;
  } catch (error) {
    logger.error('Error registering new user');
    throw error;
  }
};

export const registerEducatorService = async (body) => {
  const { email, firstName, lastName, password } = body;

  try {
    const isExisting = await UserModel.findOne({ email });
    if (isExisting) {
      throw new BadRequestException('User already exist');
    }

    const user = new UserModel({
      email,
      password,
      firstName,
      lastName,
      role: UserRoleEnum.EDUCATOR,
    });

    await user.save();

    /* 
    create an account for the user,

    since the user register using email, the provider will be EMAIL
    the providerId  will be the user email address
    */
    const account = new AccountModel({
      userId: user._id,
      provider: AccountProviderEnum.EMAIL,
      providerId: email,
    });

    await account.save();

    return user;
  } catch (error) {
    logger.error('Error registering new user');
    throw error;
  }
};
