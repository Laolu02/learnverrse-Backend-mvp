import mongoose from 'mongoose';

import { comparePassword, hashPassword } from '../utils/argonPassword.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    age: {
      type: Number,
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
