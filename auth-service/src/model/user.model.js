import mongoose from 'mongoose';

import { comparePassword, hashPassword } from '../utils/argonPassword.js';
import { UserRoleEnum } from '../enums/user-role.enum.js';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(UserRoleEnum),
      default: 'LEARNER',
      required: true,
    },

    isRoleVerified: {
      type: Boolean,
      required: true,
      default: false, //An educator must have his role verified
    },
    profilePicture: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password'))
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  next();
});

userSchema.methods.omitPassword = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.methods.verifyPassword = async function (candidatePassword) {
  return comparePassword(this.password, candidatePassword);
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
