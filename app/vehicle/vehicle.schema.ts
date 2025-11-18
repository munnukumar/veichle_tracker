// app/vehicle/vehicle.schema.ts
import { Schema, model } from "mongoose";
import { IVehicle } from "./vehicle.dto";

const VehicleSchema = new Schema<IVehicle>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["car", "bike", "scooter"], required: true },
    numberPlate: { type: String, required: true, unique: true },
    brand: String,
    model: String,
    color: String,
    price: Number,

    isAvailable: { type: Boolean, default: true },
    lastUnavailableFrom: { type: Date, default: null },
    lastUnavailableTo: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const VehicleModel = model<IVehicle>("Vehicle", VehicleSchema);
