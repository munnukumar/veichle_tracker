// app/payhttps://desktop.postman.com/?desktopVersion=11.69.6&webVersion=11.69.6-ui-251031-0111&userId=49635407&teamId=11173050&region=usment/payment.service.ts
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
  console.log("order data :", userId);
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

// Update payment using transaction ID
export const updatePaymentStatus = async (
  paymentId: string,
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED",
  razorpayPaymentId?: string
) => {
  // 1️⃣ Update the payment first
  const payment = await PaymentModel.findByIdAndUpdate(
    paymentId,
    {
      paymentStatus: status,
      transactionId: razorpayPaymentId || paymentId,
    },
    { new: true }
  );

  if (!payment) return null;

  // 2️⃣ If SUCCESS — update the booking also
  if (status === "SUCCESS") {
    await BookingModel.findByIdAndUpdate(
      payment.booking,
      {
        status: "CONFIRMED",
        paymentStatus: "SUCCESS",
        isPaid: true,
      },
      { new: true }
    );
  }

  // 3️⃣ If FAILED — update booking status
  if (status === "FAILED") {
    await BookingModel.findByIdAndUpdate(
      payment.booking,
      {
        status: "CANCELLED",
        paymentStatus: "FAILED",
        isPaid: false,
      },
      { new: true }
    );
  }

  return payment;
};

// Update payment using Razorpay order ID (webhook)
export const updateStatusByOrderId = async (
  orderId: string,
  status: "SUCCESS" | "FAILED",
  paymentId?: string
) => {
  return PaymentModel.findOneAndUpdate(
    { transactionId: orderId },
    { paymentStatus: status, transactionId: paymentId },
    { new: true }
  );
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
