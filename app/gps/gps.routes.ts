import { Router } from "express";
import * as controller from "./gps.controller";

const router = Router();

router.post("/update", controller.updateVehicleLocation); // GPS device will hit this
router.get("/:id", controller.getVehicleLocation);

export default router;
