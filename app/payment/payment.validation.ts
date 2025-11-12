// src/modules/payment/payment.validation.ts

import { body } from "express-validator";

export const createRazorpayOrder = [
  body("projectId").notEmpty().withMessage("Project ID is required")
];

export const verifyRazorpayPayment = [
  body("razorpay_order_id").notEmpty(),
  body("razorpay_payment_id").notEmpty(),
  body("razorpay_signature").notEmpty(),
  body("transactionId").notEmpty().withMessage("Transaction ID missing")
];
