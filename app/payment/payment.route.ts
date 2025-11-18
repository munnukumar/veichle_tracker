// app/payment/payment.route.ts
import { Router } from "express";
import passport from "passport";
import * as controller from "./payment.controller";
import * as validator from "./payment.validation";
import { validateRequest } from "../common/middleware/validation.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router.post(
  "/order",
  passport.authenticate("jwt", { session: false }),
  roleAuth(["USER"]),
  validator.createRazorpayOrder,
  validateRequest,
  controller.createRazorpayOrder
);

router.post(
  "/verify",
  validator.verifyRazorpayPayment,
  validateRequest,
  controller.verifyRazorpayPayment
);

router.post("/razorpay/webhook", controller.razorpayWebhook);

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  controller.getUserPayments
);

export default router;
