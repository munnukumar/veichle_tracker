import { Schema, model, Types } from "mongoose";
import { IVehicleAvailability } from "./availability.dto";

const AvailabilitySchema = new Schema(
  {
    vehicleId: { type: Types.ObjectId, ref: "Vehicle", required: true, unique: true },
    isAvailable: { type: Boolean, default: true },
    lastUnavailableFrom: Date,
    lastUnavailableTo: Date,
  },
  { timestamps: true }
);

AvailabilitySchema.index({ vehicleId: 1 });
AvailabilitySchema.index({ isAvailable: 1 });

export const AvailabilityModel = model("VehicleAvailability", AvailabilitySchema);
