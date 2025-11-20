// app/user/user.route.ts

import { Router } from "express";
import passport from "passport";

import { roleAuth } from "../common/middleware/role-auth.middleware";
import { validateRequest } from "../common/middleware/validation.middleware";

import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import { loginRateLimiter, apiRateLimiter } from "../config/rateLimiter";
const router = Router();

// Create User
router.post(
  "/create",
  userValidator.createUser,
  validateRequest,
  userController.createUser
);

// Login
router.post(
  "/login",
   loginRateLimiter,
  userValidator.loginUser,
  validateRequest,
  passport.authenticate("login", { session: false }),
  userController.login
);

// Admin: Get All Users
router.get("/", apiRateLimiter, roleAuth(["ADMIN"]), userController.getAllUsers);

// User/Admin: Get by ID
router.get("/me", apiRateLimiter, roleAuth(["ADMIN", "USER"]), userController.getUserById);

// User: Update own profile
router.patch(
  "/update",
  roleAuth(["USER"]),
  userValidator.updateUser,
  validateRequest,
  userController.updateUser
);

// Admin: Update KYC
router.patch(
  "/kyc/:id",
  apiRateLimiter,
  roleAuth(["ADMIN"]),
  validateRequest,
  userController.updateUserKYC
);

export default router;
