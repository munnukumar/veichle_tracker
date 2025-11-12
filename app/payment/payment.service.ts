// src/modules/payment/payment.service.ts

import {TransactionModel} from "./payment.schema";
import { ITransaction } from "./payment.dto";

export const createTransaction = async (
  data: Omit<ITransaction, "_id" | "id" | "createdAt" | "updatedAt">

) => {
  const result = await TransactionModel.create(data);
  return result.toJSON();
};

export const updatePaymentStatus = async (
  id: string,
  status: "PENDING" | "SUCCESS" | "FAILED",
  transactionId?: string
) => {
  return await TransactionModel.findOneAndUpdate(
    { _id: id },
    { paymentStatus: status, transactionId },
    { new: true }
  );
};

// ✅ update using Razorpay order_id
export const updateStatusByOrderId = async (
  orderId: string,
  status: "SUCCESS" | "FAILED",
  paymentId?: string
) => {
  return await TransactionModel.findOneAndUpdate(
    { transactionId: orderId },
    { paymentStatus: status, transactionId: paymentId },
    { new: true }
  );
};

export const getPaymentsByUser = async (userId: string) => {
  return await TransactionModel.find({ user: userId }).lean();
};

export const getPaymentsByProject = async (projectId: string) => {
  return await TransactionModel.find({ project: projectId }).lean();
};
