import { body } from "express-validator";

export const createBooking = [
  body("vehicleId").notEmpty(),
  body("from").isISO8601(),
  body("to").isISO8601(),
];
