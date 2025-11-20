import { PaymentModel } from "./payment.schema";
import { IPayment } from "./payment.dto";
import { BookingModel } from "../booking/booking.schema";

// Create Payment Transaction
export const createTransaction = async (
  data: Omit<IPayment, "_id" | "id" | "createdAt" | "updatedAt">
) => {
  return (await PaymentModel.create(data)).toJSON();
};

// Find pending payment for same booking & user
export const findPendingTransaction = async (
  userId: string,
  bookingId: string
) => {
  return PaymentModel.findOne({
    user: userId,
    booking: bookingId,
    paymentStatus: "PENDING",
  });
};

// Update Razorpay Order ID
export const updateTransactionOrderId = async (
  transactionId: string,
  newOrderId: string
) => {
  return PaymentModel.findByIdAndUpdate(
    transactionId,
    { transactionId: newOrderId },
    { new: true }
  );
};

// Update payment using Razorpay order ID (for webhook & verification)
export const updateStatusByOrderId = async (
  orderId: string,
  status: "SUCCESS" | "FAILED" | "REFUNDED",
  paymentId?: string
) => {
  const payment = await PaymentModel.findOneAndUpdate(
    { transactionId: orderId },
    { paymentStatus: status, transactionId: paymentId || orderId },
    { new: true }
  );

  if (!payment) return null;

  // Update booking status based on payment result
  const bookingUpdate: any = {};
  if (status === "SUCCESS") {
    bookingUpdate.status = "CONFIRMED";
    bookingUpdate.paymentStatus = "SUCCESS";
    bookingUpdate.isPaid = true;
  } else if (status === "FAILED") {
    bookingUpdate.status = "CANCELLED";
    bookingUpdate.paymentStatus = "FAILED";
    bookingUpdate.isPaid = false;
  }

  if (Object.keys(bookingUpdate).length) {
    await BookingModel.findByIdAndUpdate(payment.booking, bookingUpdate, {
      new: true,
    });
  }

  return payment;
};
// Get all user payments
export const getPaymentsByUser = async (userId: string) => {
  return PaymentModel.find({ user: userId }).populate("booking").lean();
};

// Get payments for a booking
export const getPaymentsByBooking = async (bookingId: string) => {
  return PaymentModel.find({ booking: bookingId }).lean();
};

export const getTransactionByBookingId = async (bookingId: string) => {
  return await PaymentModel.findOne({ booking: bookingId });
};
