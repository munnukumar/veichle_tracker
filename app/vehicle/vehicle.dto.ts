// app/vehicle/vehicle.dto.ts

export interface IVehicle {
  _id: string;
  title: string;
  type: "Four Wheeler" | "Two Wheeler";
  numberPlate: string;
  brand?: string;
  model?: string;
  color?: string;
  description?: string
  price: number;
  isAvailable: boolean;
  image?: string;
  lastUnavailableFrom?: Date | null;
  lastUnavailableTo?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
