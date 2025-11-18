// app/payment/payment.schema.ts
import mongoose, { Schema, Types } from "mongoose";
import { IPayment } from "./payment.dto";

const PaymentSchema = new Schema<IPayment>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    booking: { type: Types.ObjectId, ref: "Booking", required: true },

    amount: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"], 
      default: "PENDING",
    },

    transactionId: { type: String }, 
    paymentId: { type: String },     // Razorpay Order ID or Payment ID
    paymentMethod: { type: String },      // razorpay
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
