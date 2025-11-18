import { Router } from "express";
import userRoutes from "./user/user.route";
import vehicleRoutes from './vehicle/vehicle.route';
import bookingRoutes from './booking/booking.route';
import availabilityRoutes from './availability/availability.routes';
// import historyRoutes from './history/history.route';
import paymentRoute from './payment/payment.route'
import gpsRoute from './gps/gps.routes'

const router = Router();

router.use("/users", userRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/bookings', bookingRoutes);
router.use('/availability', availabilityRoutes);
// router.use('/history', historyRoutes);
router.use('/payment', paymentRoute);
router.use('/gps', gpsRoute)


router.get("/", (_req, res) => res.json({ ok: true, version: "1.0.0" }));

export default router;
