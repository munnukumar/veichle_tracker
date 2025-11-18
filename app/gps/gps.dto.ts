export interface IVehicleLocation {
  _id: string;
  vehicleId: object;
  latitude: number;
  longitude: number;
  speed?: number;
  isOnline: boolean;
  lastUpdated: Date;
}
