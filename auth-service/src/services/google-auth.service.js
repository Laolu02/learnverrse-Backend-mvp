import { AccountProviderEnum } from '../enums/account-provider.enum.js';
import { UserRoleEnum } from '../enums/user-role.enum.js';
import AccountModel from '../model/account.model.js';
import UserModel from '../model/user.model.js';

export const googleLoginOrCreateAccountService = async (body) => {
  const { provider, firstName, lastName, providerId, profilePicture, email } =
    body;

  try {
    let user = await UserModel.findOne({ email });
    if (!user) {
      // Create a new user if it doesn't exist
      const user = new UserModel({
        provider,
        providerId,
        email,
        firstName,
        lastName,
        profilePicture,
        role: UserRoleEnum.LEARNER,
        isRoleVerified: true, //learner is automatically verified while educator needs admin approval
      });

      await user.save();

      /* 
    create an account for the user,

    since the user register using email, the provider will be EMAIL
    the providerId  will be the user email address
    */
      const account = new AccountModel({
        userId: user._id,
        provider: AccountProviderEnum.GOOGLE,
        providerId: email,
        isVerified: true, // Google account is automatically verified
      });

      await account.save();
    }

    return user;
  } catch (error) {
    throw error;
  }
};
