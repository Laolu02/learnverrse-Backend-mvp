import { AccountProviderEnum } from '../enums/account-provider.enum.js';
import { verifyOtp } from '../utils/verifyOtp.js';

export const verifyRegisterOtpService = async (body) => {
  try {
    const { email, code } = body;

    const account = await AccountModel.findOne({
      provider: AccountProviderEnum.EMAIL,
      providerId: email,
      isVerified: false,
    });

    if (!account) {
      throw new BadRequestException(
        'Account does not exist or has been verified'
      );
    }

    const validOtp = await verifyOtp(email, code);

    if (!validOtp) {
      throw new Error('Invalid OTP');
    }

    account.isVerified = true;
    await account.save();

    return { account };
  } catch (error) {
    logger.error(`cannot verify OTP ${error}`);
    throw new Error('Verifying register OTP error');
  }
};
