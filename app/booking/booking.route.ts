// app/booking/booking.routes.ts
import { Router } from "express";
import passport from "passport";
import { validateRequest } from "../common/middleware/validation.middleware";
import * as controller from "./booking.controller";
import * as validator from "./booking.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  // validator.createBooking,
  validateRequest,
  controller.createBooking
);

router.get(
  "/history",
  roleAuth(["ADMIN"]), // Only admin can access
  controller.getAdminBookingHistory
);

router.get(
  "/my-booking",
  passport.authenticate("jwt", { session: false }),
  controller.getUserBooking
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getBookingById
);

router.patch(
  "/cancel/:id",
  passport.authenticate("jwt", { session: false }),
  controller.cancelBooking
);

export default router;
