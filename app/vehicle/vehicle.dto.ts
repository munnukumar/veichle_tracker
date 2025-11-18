// app/vehicle/vehicle.dto.ts

export interface IVehicle {
  _id: string;
  title: string;
  type: "car" | "bike" | "van" | "bus" | "truck";
  numberPlate: string;
  brand?: string;
  model?: string;
  color?: string;
  price: number;
   isAvailable: boolean;
  lastUnavailableFrom?: Date | null;
  lastUnavailableTo?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
