import { Router } from "express";
// import authRoutes from "./auth/auth.route";
import userRoutes from "./user/user.route";
// import projectRoutes from "./project/project.route";

const router = Router();

// router.use("/auth", authRoutes);
router.use("/users", userRoutes);
// router.use("/projects", projectRoutes);

export default router;
