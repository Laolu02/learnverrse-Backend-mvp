import UserModel from '../model/user.model.js';
import { NotFoundException } from '../utils/appError.js';
import { verifyOtp } from '../utils/verifyOtp.js';

export const verifyForgotPasswordService = async (body) => {
  try {
    const { email, code } = body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('user does not exist');
    }

    const validOtp = await verifyOtp(email, code);

    if (!validOtp) {
      throw new Error('Invalid OTP');
    }
    return user;
  } catch (error) {
    throw error;
  }
};
