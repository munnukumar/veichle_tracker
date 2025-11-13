import { TransactionModel } from "./payment.schema";
import { ITransaction } from "./payment.dto";

// ✅ Create Transaction
export const createTransaction = async (
  data: Omit<ITransaction, "_id" | "id" | "createdAt" | "updatedAt">
) => {
  const result = await TransactionModel.create(data);
  return result.toJSON();
};

// ✅ Find existing pending transaction for same user & project
export const findPendingTransaction = async (userId: string, projectId: string) => {
  return await TransactionModel.findOne({
    user: userId,
    project: projectId,
    paymentStatus: "PENDING",
  });
};

// ✅ Update transactionId (Razorpay order id) when reusing existing transaction
export const updateTransactionOrderId = async (transactionId: string, newOrderId: string) => {
  return await TransactionModel.findByIdAndUpdate(
    transactionId,
    { transactionId: newOrderId },
    { new: true }
  );
};

// ✅ Update payment status by transaction _id
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

// ✅ Update payment by Razorpay order_id (webhook)
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

// ✅ Get all payments of a user
export const getPaymentsByUser = async (userId: string) => {
  return await TransactionModel.find({ user: userId })
    .populate("project")
    .lean();
};

// ✅ Get all payments for a project
export const getPaymentsByProject = async (projectId: string) => {
  return await TransactionModel.find({ project: projectId }).lean();
};
