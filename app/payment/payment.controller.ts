// src/modules/payment/payment.controller.ts

import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import crypto from "crypto";
import createHttpError from "http-errors";
import { createResponse } from "../common/helper/response.helper";
import { razorpay } from "../config/razorpay.config";
import * as paymentService from "./payment.service";
import * as projectService from "../project/project.service";


// Create Razorpay Order
export const createRazorpayOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const { projectId } = req.body;

  const project = await projectService.fetchProjectById(projectId);

  if (!project) throw createHttpError(404, "Project not found");

  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount: project.price * 100, // paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  // Create pending transaction
  const transaction = await paymentService.createTransaction({
    user: userId,
    project: projectId,
    amount: project.price,
    paymentStatus: "PENDING",
    paymentMethod: "razorpay",
    transactionId: order.id,
  });

let razorpay_order_id = order.id;
let razorpay_payment_id = "test_payment_id";
const signBody = razorpay_order_id + "|" + razorpay_payment_id;

  const signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET!)
    .update(signBody)
    .digest("hex");

console.log(signature);

  res.send(
    createResponse(
      {
        order,
        transactionId: transaction._id,
        signature
      },
      "Razorpay order created"
    )
  );
});


// Verify Razorpay Payment
export const verifyRazorpayPayment = asyncHandler(async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;

  const signBody = razorpay_order_id + "|" + razorpay_payment_id;

  console.log("Sign Body:", signBody);

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET!)
    .update(signBody)
    .digest("hex");

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

  if (expectedSignature !== razorpay_signature) {
    throw createHttpError(400, "Invalid Razorpay signature");
  }

  const updated = await paymentService.updatePaymentStatus(
    transactionId,
    "SUCCESS",
    razorpay_payment_id
  );

  res.send(createResponse(updated, "Payment verified successfully"));
});


// Razorpay Webhook
export const razorpayWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers["x-razorpay-signature"] as string;

  const payload = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(payload)
    .digest("hex");

  if (expectedSignature !== signature) {
    res.status(400).send("Invalid webhook signature");
    return;
  }

  const event = req.body;

  if (event.event === "payment.captured") {
    const paymentId = event.payload.payment.entity.id;
    const orderId = event.payload.payment.entity.order_id;

    await paymentService.updateStatusByOrderId(orderId, "SUCCESS", paymentId);
  }

  res.send("Webhook received");
});


// Get logged-in user's payments
export const getUserPayments = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;

  const payments = await paymentService.getPaymentsByUser(userId);

  res.send(createResponse(payments, "Payments fetched successfully"));
});


// Get payments for a project
export const getPaymentsByProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  const payments = await paymentService.getPaymentsByProject(projectId);

  res.send(createResponse(payments, "Project payments fetched successfully"));
});
