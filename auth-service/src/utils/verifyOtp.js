import OtpModel from '../model/otp.model.js';
import argon2 from 'argon2';

export const verifyOtp = async (email, code) => {
  let currentDate = Date.now();
  const otpDoc = await OtpModel.findOne({ email });

  if (!otpDoc) return false;

  const isExpired = otpDoc.expiresAt.getTime() < currentDate;
  const isMatch = await argon2.verify(otpDoc.code, code);

  if (isMatch && !isExpired) {
    await otpDoc.deleteOne(); // Invalidate OTP after use
    return true;
  }

  return false;
};
