// app/payment/payment.dto.ts
import { BaseSchema } from "../common/dto/base.dto";

export interface IPayment extends BaseSchema {
  _id: string;

  user: object;
  booking: object;

  amount: number;

  paymentStatus: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  transactionId?: string; 
  paymentId?: string;           // Razorpay order_id OR payment_id
  paymentMethod?: string;         // "razorpay"
}
