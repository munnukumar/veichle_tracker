// app/vehicle/vehicle.route.ts
import { Router } from "express";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import { validateRequest } from "../common/middleware/validation.middleware";
import * as controller from "./vehicle.controller";
import * as validator from "./vehicle.validation";
import {
  upload,
  cloudinaryUpload,
} from "../common/middleware/upload.middleware";

const router = Router();

router.post(
  "/add",
  roleAuth(["ADMIN"]),
  upload.single("image"),
  cloudinaryUpload("image"),
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
