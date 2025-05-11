import mongoose, { Schema } from 'mongoose';
import { SubscriptionTypeEnum } from '../enums/subscription-type.enum.js';
import { AccountProviderEnum } from '../enums/account-provider.enum.js';

const accountSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: String,
      enum: Object.values(AccountProviderEnum),
      required: true,
    },
    providerId: {
      type: String,
      unique: true,
      required: true,
    },
    subscription: {
      type: String,
      enum: Object.values(SubscriptionTypeEnum),
      default: 'BASIC',
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AccountModel = mongoose.model('Account', accountSchema);
export default AccountModel;
