// app/booking/booking.service.ts
import { BookingModel } from "./booking.schema";
import { VehicleModel } from "../vehicle/vehicle.schema";
import * as paymentService from "../payment/payment.service";
import { razorpay } from "../config/razorpay.config";
import { IBooking } from "./booking.dto";
import createHttpError from "http-errors";
import { GPSLocationModel } from "../gps/gps.schema";
import { AvailabilityService } from "../availability/availability.service";
const availabilityService = new AvailabilityService();

// -------------------------------
// Create Booking (with conflict)
// -------------------------------
//service//
export const createBooking = async (data: IBooking) => {
  const { vehicleId, from, to } = data;

  // Validate dates
  if (!from || !to) {
    throw createHttpError(400, "From and To dates are required");
  }

  const start = new Date(from);
  const end = new Date(to);

  if (end <= start) {
    throw createHttpError(400, "To date must be greater than From date");
  }

  // Fetch vehicle to get price
  const vehicle = await VehicleModel.findById(vehicleId);
  if (!vehicle) {
    throw createHttpError(404, "Vehicle not found");
  }

  const pricePerDay = vehicle.price;

  // Calculate number of days
  const diff = end.getTime() - start.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  // Calculate total amount
  const totalAmount = pricePerDay * days;

  // Check booking conflicts
  const conflict = await BookingModel.findOne({
    vehicleId,
    status: { $in: ["PENDING", "CONFIRMED"] },
    $or: [{ from: { $lt: to }, to: { $gt: from } }],
  });

  if (conflict) {
    throw createHttpError(409, "Vehicle is already booked for these dates");
  }

  // Create booking with totalAmount added
  const booking = await BookingModel.create({
    ...data,
    totalAmount,
  });
  await availabilityService.setUnavailable(vehicleId.toString(), from, to);

  // 4️⃣ Ensure GPS record exists for that vehicle
  await GPSLocationModel.findOneAndUpdate(
    { vehicleId },
    { isOnline: true },
    { upsert: true }
  );

  return booking;
};

// -------------------------------
// Fetch Booking
// -------------------------------
export const fetchBookingById = async (bookingId: string) => {
  return BookingModel.findById(bookingId)
    .populate("userId")
    .populate("vehicleId");
};

// -------------------------------
// Update Booking After Payment
// -------------------------------
export const updateBookingPayment = async (
  bookingId: string,
  status: "SUCCESS" | "FAILED"
) => {
  return BookingModel.findByIdAndUpdate(
    bookingId,
    {
      paymentStatus: status,
      isPaid: status === "SUCCESS",
      status: status === "SUCCESS" ? "CONFIRMED" : "CANCELLED",
    },
    { new: true }
  );
};

// -------------------------------
// Cancel Booking
// -------------------------------
export const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) throw createHttpError(404, "Booking not found");

  // Only owner can cancel
  if (booking.userId.toString() !== userId.toString()) {
    throw createHttpError(403, "You are not allowed to cancel this booking");
  }

  // Disallow cancel after trip end
  if (new Date(booking.to) < new Date()) {
    throw createHttpError(400, "Trip already completed — cannot cancel");
  }

  if (booking.status === "CANCELLED") {
    throw createHttpError(400, "Booking already cancelled");
  }

  // Make vehicle available again
  await availabilityService.setAvailable(booking.vehicleId.toString());

  // Handle refund if paid
  let refundResponse = null;

  if (booking.paymentStatus === "SUCCESS") {
    const tx = await paymentService.getTransactionByBookingId(bookingId);

    if (tx?.paymentId) {
      refundResponse = await razorpay.payments.refund(tx.paymentId, {
        amount: booking.totalAmount * 100,
        speed: "normal",
      });

      await paymentService.updatePaymentStatus(tx._id, "REFUNDED");
    }
  }

  // Update booking status
  const updatedBooking = await BookingModel.findByIdAndUpdate(
    bookingId,
    {
      status: "CANCELLED",
      paymentStatus:
        booking.paymentStatus === "SUCCESS" ? "REFUNDED" : "FAILED",
    },
    { new: true }
  );

  await GPSLocationModel.findOneAndUpdate(
    { vehicleId: booking.vehicleId },
    { isOnline: false }
  );

  return { updatedBooking, refundResponse };
};

export const getAdminBookingHistory = async () => {
  // Step 1 → Get vehicles owned by admin
  const history = await BookingModel.find()
    .select(["from", "to", "totalAmount", "status", "paymentStatus", "isPaid" ])
    .populate("userId", "name email")
    .populate("vehicleId", "title type numberPlate price")
    .sort({ from: -1 })
    .lean();

  return history;
};
