import { Router } from "express";
import passport from "passport";
// import { catchError } from "../common/middleware/catch-error.middleware";
// import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as userController from "./user.controller";
import { get } from "http";
import { roleAuth } from "../common/middleware/role-auth.middleware";
// import { createUserValidator } from "./user.validator";

const router = Router();
console.log("User routes loaded");

/**
 * @route POST /users/create
 * @group Users - Operations about users
 * @param {object} user.body.required - User info
 * @property {string} user.name.required - User name
 * @property {string} user.email.required - User email
 * @property {string} user.password.required - User password
 * @returns {object} 201 - Created user
 */
router.post("/create", userController.createUser)
router.get("/profile", userController.getAllUsers)
router.get("/:id", roleAuth(["USER"]), userController.getUserById)
router.get("/update", roleAuth(["USER"]), userController.updateUser)
router.post("/login",
    passport.authenticate("login", { session: false }),
    userController.login)



export default router; 
