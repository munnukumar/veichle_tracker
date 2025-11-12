// src/modules/payment/payment.routes.ts

import { Router } from "express";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import { catchError } from "../common/middleware/catch-error.middleware";
import * as paymentController from "./payment.controller";
import * as paymentValidator from "./payment.validation";

const router = Router();
console.log("Payment routes loaded");

// Create Razorpay order
router.post(
  "/razorpay/order",
  roleAuth(["USER", "ADMIN"]),
  paymentValidator.createRazorpayOrder,
  catchError,
  paymentController.createRazorpayOrder
);

// Verify Razorpay payment
router.post(
  "/razorpay/verify",
  paymentValidator.verifyRazorpayPayment,
  catchError,
  paymentController.verifyRazorpayPayment
);

// Razorpay webhook
router.post(
  "/razorpay/webhook",
  paymentController.razorpayWebhook
);

export default router;
