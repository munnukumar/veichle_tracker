// app/booking/booking.dto.ts

import { Types } from "mongoose";

export interface IBooking {
  _id?: string;

  userId: object;
  vehicleId: object;

  from: Date;
  to: Date;

  totalAmount: number;

  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

  isPaid: boolean;

  pickupLocation?: string;
  dropLocation?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
