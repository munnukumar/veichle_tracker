import asyncHandler from "express-async-handler";
import { AvailabilityService } from "./availability.service";
import { AvailabilityModel } from "./availability.schema";

const availabilityService = new AvailabilityService();

export const getAvailability = asyncHandler(async (req, res) => {
  const vehicleId = req.params.vehicleId;
  const record = await availabilityService.ensure(vehicleId);
  res.json({ success: true, data: record });
});

export const getAvailableVehicles = asyncHandler(async (req, res) => {
  const availableVehicles = await AvailabilityModel.find({
    isAvailable: true,
  }).populate("vehicleId");

  const total = await AvailabilityModel.countDocuments({
    isAvailable: true,
  });

  res.json({
    success: true,
    message: "Available vehicles fetched successfully",
    data: {
      vehicles: availableVehicles,
      total,
    },
  });
});

