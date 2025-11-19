import { AvailabilityModel } from "./availability.schema";

export class AvailabilityService {
  async ensure(vehicleId: string) {
    let record = await AvailabilityModel.findOne({ vehicleId }).populate("vehicleId");
    if (!record) record = await AvailabilityModel.create({ vehicleId });
    return record;
  }

  async setUnavailable(vehicleId: string, from: Date, to: Date) {
    return AvailabilityModel.findOneAndUpdate(
      { vehicleId },
      {
        isAvailable: false,
        lastUnavailableFrom: from,
        lastUnavailableTo: to,
      },
      { new: true, upsert: true }
    );
  }

  async setAvailable(vehicleId: string) {
    return AvailabilityModel.findOneAndUpdate(
      { vehicleId },
      {
        isAvailable: true,
        lastUnavailableFrom: null,
        lastUnavailableTo: null,
      },
      { new: true }
    );
  }

  async isVehicleFree(vehicleId: string, from: Date, to: Date) {
    const record = await AvailabilityModel.findOne({ vehicleId });

    if (!record || record.isAvailable) return true;

    // If booking trying to overlap with existing reservation
    if (
      record.lastUnavailableFrom &&
      record.lastUnavailableTo &&
      to > record.lastUnavailableFrom &&
      from < record.lastUnavailableTo
    ) {
      return false;
    }

    return true;
  }

  // Auto-release when booking ends
  async releaseEndedBookings() {
    const now = new Date();
    return AvailabilityModel.updateMany(
      { lastUnavailableTo: { $lte: now } },
      {
        isAvailable: true,
        lastUnavailableFrom: null,
        lastUnavailableTo: null,
      }
    );
  }
}
