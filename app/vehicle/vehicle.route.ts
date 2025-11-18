// app/vehicle/vehicle.route.ts
import { Router } from "express";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import { validateRequest } from "../common/middleware/validation.middleware";
import * as controller from "./vehicle.controller";
import * as validator from "./vehicle.validation";

const router = Router();

router.post(
  "/add",
  roleAuth(["ADMIN"]),
  validator.createVehicle,
  validateRequest,
  controller.createVehicle
);

router.get("/", controller.getVehicles);

router.patch(
  "/:id",
  roleAuth(["ADMIN"]),
  validator.updateVehicle,
  validateRequest,
  controller.updateVehicle
);

export default router;
