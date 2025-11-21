// app/vehicle/vehicle.service.ts
import { VehicleModel } from "./vehicle.schema";
import { IVehicle } from "./vehicle.dto";
import { AvailabilityService } from "../availability/availability.service";
const availability = new AvailabilityService

export class VehicleService {
  async create(data: Partial<IVehicle>) {
    const vehicle = await VehicleModel.create(data);
    await availability.ensure(vehicle._id.toString());

    return vehicle;
  }

  async update(id: string, data: Partial<IVehicle>) {
    return VehicleModel.findByIdAndUpdate(id, data, { new: true });
  }

 async findAll() {
  const vehicles = await VehicleModel.find();
  const total = await VehicleModel.countDocuments();

  return { vehicles, total };
}


  async findById(id: string) {
    return VehicleModel.findById(id);
  }
}
