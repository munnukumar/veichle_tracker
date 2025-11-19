// app/vehicle/vehicle.validation.ts
import { body } from "express-validator";

export const createVehicle = [
  body("title").notEmpty(),
  body("type").isIn(["Four Wheeler", "Two Wheeler"]),
  body("numberPlate").notEmpty(),
];

export const updateVehicle = [
  body("title").optional(),
  body("type").optional().isIn(["car", "bike", "van", "bus", "truck"]),
  body("isActive").optional().isBoolean(),
];
