import UserModel from '../model/user.model.js';
import { NotFoundException } from '../utils/appError.js';

export const setPasswordService = async (body) => {
  const { email, password } = body;
  try {
    const user = await UserModel.findOne({ email });
    console.log(user);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    user.password = password;

    await user.save();

    return user;
  } catch (error) {
    throw error;
  }
};
