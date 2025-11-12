// src/config/razorpay.config.ts

import Razorpay from "razorpay";
console.log("Razorpay config loaded", process.env.RAZORPAY_KEY_ID);
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});
