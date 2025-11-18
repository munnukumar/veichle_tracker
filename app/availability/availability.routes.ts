import { Router } from "express";
import passport from "passport";
import * as controller from "./availability.controller";

const router = Router();

router.get("/list", controller.getAvailableVehicles);

router.get("/:vehicleId", controller.getAvailability);

export default router;
