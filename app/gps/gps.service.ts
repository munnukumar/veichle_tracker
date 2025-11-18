import { GPSLocationModel } from "./gps.schema";

export class GPSService {
  async updateLocation(data: {
    vehicleId: string;
    latitude: number;
    longitude: number;
    speed?: number;
  }) {
    return GPSLocationModel.findOneAndUpdate(
      { vehicleId: data.vehicleId },
      {
        ...data,
        isOnline: true,
        lastUpdated: new Date(),
      },
      { new: true, upsert: true }
    );
  }

  async getLocation(vehicleId: string) {
    return GPSLocationModel.findOne({ vehicleId });
  }

  async markOffline(vehicleId: string) {
    return GPSLocationModel.findOneAndUpdate(
      { vehicleId },
      { isOnline: false },
      { new: true }
    );
  }
}
