import { AccountProviderEnum } from '../enums/account-provider.enum.js';
import { UserRoleEnum } from '../enums/user-role.enum.js';
import AccountModel from '../model/account.model.js';
import UserModel from '../model/user.model.js';
import logger from '../utils/logger.js';
import generateJwtToken from '../utils/generateJwt.js';
import AsyncHandler from '../middlewares/asyncHandler.js';

export const handleGoogleAuth = AsyncHandler(async (profile) => {
  const existingUser = await UserModel.findOne({
    email: profile.emails[0].value,
  });

  if (existingUser) {
    // Check if they have a Google account
    const googleAccount = await AccountModel.findOne({
      userId: existingUser._id,
      provider: AccountProviderEnum.GOOGLE,
    });

    if (!googleAccount) {
      // Create Google account for existing user
      await AccountModel.create({
        userId: existingUser._id,
        provider: AccountProviderEnum.GOOGLE,
        providerId: profile.id,
        isVerified: true, // Google accounts are pre-verified
      });
    }

    const tokens = await generateJwtToken(existingUser);
    return { user: existingUser, ...tokens };
  }

  // Create new user
  const newUser = await UserModel.create({
    email: profile.emails[0].value,
    name: profile.displayName,
    profilePicture: profile.photos?.[0]?.value,
    role: UserRoleEnum.LEARNER,
    // No password needed for OAuth users
  });

  // Create Google account for new user
  await AccountModel.create({
    userId: newUser._id,
    provider: AccountProviderEnum.GOOGLE,
    providerId: profile.id,
    isVerified: true,
  });

  const tokens = await generateJwtToken(newUser);
  return { user: newUser, ...tokens };
});

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
        isRoleVerified: true, //learning is automatically verified while educator needs admin approval
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
  } catch (error) {}
};
