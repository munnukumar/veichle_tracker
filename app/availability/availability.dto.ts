export interface IVehicleAvailability {
  _id: string;
  vehicleId: object;
  isAvailable: boolean;
  lastUnavailableFrom?: Date;
  lastUnavailableTo?: Date;
}
