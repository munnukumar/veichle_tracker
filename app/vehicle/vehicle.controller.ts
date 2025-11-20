// app/vehicle/vehicle.controller.ts
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { createResponse } from "../common/helper/response.helper";
import { VehicleService } from "./vehicle.service";

const service = new VehicleService();

export const createVehicle = asyncHandler(
  async (req: Request, res: Response) => {
    const vehicle = await service.create(req.body);
    console.log("data :", req.body)
    res
      .status(201)
      .send(createResponse(vehicle, "Vehicle created successfully"));
  }
);

export const getVehicles = asyncHandler(
  async (_req: Request, res: Response) => {
    const vehicles = await service.findAll();
    res.send(createResponse(vehicles, "Vehicles fetched"));
  }
);

export const updateVehicle = asyncHandler(
  async (req: Request, res: Response) => {
    const updated = await service.update(req.params.id, req.body);
    res.send(createResponse(updated, "Vehicle updated"));
  }
);
