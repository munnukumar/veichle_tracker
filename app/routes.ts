import { Router } from "express";
// import authRoutes from "./auth/auth.route";
import userRoutes from "./user/user.route";
import projectRoutes from "./project/project.route";
import paymentRoutes from "./payment/payment.route";
// import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "./docs/swagger.json";

const router = Router();

// router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/payments", paymentRoutes);
// router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
