// app/vehicle/vehicle.schema.ts
import { Schema, model } from "mongoose";
import { IVehicle } from "./vehicle.dto";

const VehicleSchema = new Schema<IVehicle>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["Four Wheeler", "Two Wheeler"],
      required: true,
    },
    numberPlate: { type: String, required: true, unique: true },
    brand: String,
    model: String,
    color: String,
    price: Number,
    image: String,
    description: String,
    isAvailable: { type: Boolean, default: true },
    lastUnavailableFrom: { type: Date, default: null },
    lastUnavailableTo: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const VehicleModel = model<IVehicle>("Vehicle", VehicleSchema);
