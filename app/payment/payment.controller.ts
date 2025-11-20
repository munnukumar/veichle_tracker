import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import crypto from "crypto";
import createHttpError from "http-errors";

import { createResponse } from "../common/helper/response.helper";
import { razorpay } from "../config/razorpay.config";

import * as paymentService from "./payment.service";
import * as bookingService from "../booking/booking.service";

// ------------------------------------------------------
// CREATE RAZORPAY ORDER
// ------------------------------------------------------
export const createRazorpayOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)._id;
    const { bookingId } = req.body;

    const booking = await bookingService.fetchBookingById(bookingId);
    if (!booking) throw createHttpError(404, "Booking not found");

    const amount = booking.totalAmount;
    if (!amount) throw createHttpError(400, "Booking amount missing");

    // 1️⃣ Check pending transaction
    const pendingTx = await paymentService.findPendingTransaction(userId, bookingId);

    // 2️⃣ Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `bk_${bookingId.slice(-6)}_${Date.now().toString().slice(-6)}`,
    });

    let transaction;

    if (pendingTx) {
      // update existing pending order with new Razorpay order id
      transaction = await paymentService.updateTransactionOrderId(pendingTx._id, order.id);
    } else {
      // create new transaction
      transaction = await paymentService.createTransaction({
        user: userId,
        booking: bookingId,
        amount,
        paymentStatus: "PENDING",
        paymentMethod: "razorpay",
        transactionId: order.id, // store Razorpay order id
        id: "", // required by BaseSchema but ignored by Mongo
      } as any);
    }

    if (!transaction) throw createHttpError(500, "Failed to create or update payment transaction");

    // Generate dummy signature for testing (frontend usually generates this)
    const razorpay_order_id = transaction.transactionId;
    const razorpay_payment_id = "pay_dummy_12345"; // For testing
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    res.send(
      createResponse(
        {
          order,
          transactionId: transaction._id, // internal DB id
          signature,
        },
        "Razorpay order created"
      )
    );
  }
);

// ------------------------------------------------------
// VERIFY RAZORPAY PAYMENT
// ------------------------------------------------------
export const verifyRazorpayPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw createHttpError(400, "Missing required payment fields");
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw createHttpError(400, "Invalid Razorpay signature");
    }

    // Update payment using Razorpay order ID
    const updated = await paymentService.updateStatusByOrderId(
      razorpay_order_id,
      "SUCCESS",
      razorpay_payment_id
    );

    if (!updated) throw createHttpError(500, "Payment update failed");

    res.send(createResponse(updated, "Payment verified successfully"));
  }
);

// ------------------------------------------------------
// RAZORPAY WEBHOOK
// ------------------------------------------------------
export const razorpayWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers["x-razorpay-signature"] as string;
  const payload = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(payload)
    .digest("hex");

  if (expectedSignature !== signature) {
    throw createHttpError(400, "Invalid webhook signature");
  }

  const event = req.body;

  if (event.event === "payment.captured") {
    const paymentId = event.payload.payment.entity.id;
    const orderId = event.payload.payment.entity.order_id;

    await paymentService.updateStatusByOrderId(orderId, "SUCCESS", paymentId);
  }

  res.send("Webhook received successfully");
});

// ------------------------------------------------------
// GET LOGGED-IN USER PAYMENTS
// ------------------------------------------------------
export const getUserPayments = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const payments = await paymentService.getPaymentsByUser(userId);

  res.send(createResponse(payments, "User payments fetched"));
});


