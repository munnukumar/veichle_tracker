import { Router } from "express";
import passport from "passport";
import { catchError } from "../common/middleware/catch-error.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as userController from "./user.controller";
import { get } from "http";
import * as userValidatior from "./user.validation";


const router = Router();
console.log("User routes loaded");

router.post("/create",userValidatior.createUser,catchError, userController.createUser)
router.get("/profile", userController.getAllUsers)
router.get("/:id", userController.getUserById)
router.patch("/update", userValidatior.updateUser,catchError, roleAuth(["USER"]), userController.updateUser)
router.post("/login",
    userValidatior.loginUser,
    catchError,
    passport.authenticate("login", { session: false }),
    userController.login)



export default router; 
