import cron from "node-cron";
import { BookingModel } from "../../booking/booking.schema";
import { VehicleModel } from "../../vehicle/vehicle.schema";
import { AvailabilityService } from "../../availability/availability.service";
import { GPSLocationModel } from "../../gps/gps.schema";

const availabilityService = new AvailabilityService();

export const startCronJobs = () => {
  /**
   * =====================================================
   * CRON JOB 1: AUTO COMPLETE EXPIRED BOOKINGS
   * Runs every 5 minutes
   * =====================================================
   */
  cron.schedule("*/5 * * * *", async () => {
    console.log("CRON: Checking expired bookings...");

    const now = new Date();

    const expiredBookings = await BookingModel.find({
      status: "CONFIRMED",
      to: { $lt: now },
    });

    if (!expiredBookings.length) return;

    for (const booking of expiredBookings) {
      const vehicleId = booking.vehicleId.toString();

      await availabilityService.setAvailable(vehicleId);

      await GPSLocationModel.findOneAndUpdate(
        { vehicleId },
        { isOnline: false }
      );

      await BookingModel.findByIdAndUpdate(
        booking._id,
        {
          status: "COMPLETED",
          tripEndedAt: new Date(),
          gpsTrackingEnabled: false,
        },
        { new: true }
      );
    }
  });

  /**
   * =====================================================
   * CRON JOB 2: GPS OFFLINE VEHICLE DETECTION
   * Runs every 2 minutes
   * Rule: If no GPS update for 5 mins → mark vehicle offline
   * =====================================================
   */
  cron.schedule("*/2 * * * *", async () => {
    console.log("CRON: Checking GPS offline vehicles...");

    // If a vehicle has no update for last 5 minutes
    const offlineThreshold = new Date(Date.now() - 5 * 60 * 1000);

    const staleVehicles = await GPSLocationModel.find({
      lastUpdated: { $lt: offlineThreshold },
      isOnline: true, // only mark currently online → offline
    });

    if (!staleVehicles.length) return;

    for (const vehicle of staleVehicles) {
      await GPSLocationModel.findByIdAndUpdate(vehicle._id, {
        isOnline: false,
      });

      console.log(`CRON: Vehicle ${vehicle.vehicleId} marked as OFFLINE`);
    }
  });
};
