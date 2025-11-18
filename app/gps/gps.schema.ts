import { Schema, model, Types } from "mongoose";
import { IVehicleLocation } from "./gps.dto";

const GPSLocationSchema = new Schema<IVehicleLocation>(
  {
    vehicleId: { type: Types.ObjectId, ref: "Vehicle", required: true },
    latitude: Number,
    longitude: Number,
    speed: Number,
    isOnline: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const GPSLocationModel = model("VehicleLocation", GPSLocationSchema);
