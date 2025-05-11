import mongoose from "mongoose";
import { UserRoleEnum } from "../enums/user-role.enum";
import { hashPassword, comparePassword } from "../utils/argonPassword";

const educatorSchema =  new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
          },
          password: {
            type: String,
            required: true,
          },
          role: {
            type: String,
            enum:Object.values(UserRoleEnum),
            required: true,
          },
          profilePicture: {
            type: String,
          },
          age: {
            type: Number,
            required: true,
          },
          /*isVerified */
    }, {timestamps: true}
);
educatorSchema.pre('save', async function (next) {
  if (this.isModified('password'))
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  next();
});

educatorSchema.methods.omitPassword = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

educatorSchema.methods.verifyPassword = async function (candidatePassword) {
  return comparePassword(this.password, candidatePassword);
};
const EducatorModel = mongoose.model('educator', educatorSchema)

export default EducatorModel;