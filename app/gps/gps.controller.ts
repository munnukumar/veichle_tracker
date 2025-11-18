import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { GPSService } from "./gps.service";
import { createResponse } from "../common/helper/response.helper";

const service = new GPSService();

export const updateVehicleLocation = asyncHandler(
  async (req: Request, res: Response) => {
    const updated = await service.updateLocation(req.body);
    res.send(createResponse(updated, "Location updated"));
  }
);

export const getVehicleLocation = asyncHandler(
  async (req: Request, res: Response) => {
    const location = await service.getLocation(req.params.id);
    res.send(createResponse(location, "Location fetched"));
  }
);
