// app/booking/booking.controller.ts
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import * as bookingService from "./booking.service";
import { createResponse } from "../common/helper/response.helper";

//controller//
export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)._id;

    const booking = await bookingService.createBooking({
      ...req.body,
      userId,
    });

    res.send(createResponse(booking, "Booking created successfully"));
  }
);

export const getBookingById = asyncHandler(
  async (req: Request, res: Response) => {
    const booking = await bookingService.fetchBookingById(req.params.id);
    res.send(createResponse(booking, "Booking fetched"));
  }
);

export const cancelBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const userId = (req.user as any)._id;

    const result = await bookingService.cancelBooking(bookingId, userId);

    res.send(createResponse(result, "Booking cancelled successfully"));
  }
);

export const getAdminBookingHistory = asyncHandler(async (req, res) => {
  const history = await bookingService.getAdminBookingHistory();

  res.send(createResponse(history, "Admin booking history fetched"));
});
