import mongoose from 'mongoose';


const PaymentSchema = new mongoose.Schema(
  {
     email:{
      type: String,
      required: true,
     },
     amount:{
      type: Number,
      required: true,
     },
     userId:{
      type: String,
      required: true,
     },
     courseId:{
      type: String,
      required: true,
     },
     idempotenceId:{
      type: String,
      required: true,
      unique: true
     },
     reference: {
      type: String,
       unique: true
     },
     status: {
      type: String,
      default: "pending"
     }
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', PaymentSchema);

