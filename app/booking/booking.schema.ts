// app/booking/booking.schema.ts
import { Schema, model, Types } from "mongoose";
import { IBooking } from "./booking.dto";

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },

    vehicleId: { type: Types.ObjectId, ref: "Vehicle", required: true },

    from: { type: Date, required: true },
    to: { type: Date, required: true },

    totalAmount: { type: Number },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING",
    },

    isPaid: { type: Boolean, default: false },

    pickupLocation: { type: String },
    dropLocation: { type: String },
  },
  { timestamps: true }
);

// INDEXES FOR BETTER PERFORMANCE
BookingSchema.index({ vehicleId: 1, from: 1, to: 1 });

export const BookingModel = model("Booking", BookingSchema);
