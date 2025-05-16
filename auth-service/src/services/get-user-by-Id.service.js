import UserModel from '../model/user.model.js';
import { NotFoundException } from '../utils/appError.js';

export const getUserByIdService = async (id) => {
  try {
    const user = await UserModel.findById(id);

    if (!user) {
      throw new NotFoundException(`User: ${id} not found`);
    }

    return user.omitPassword();
  } catch (error) {
    throw error;
  }
};
