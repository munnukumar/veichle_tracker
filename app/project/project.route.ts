// src/modules/projects/project.routes.ts

import { Router } from "express";
import { catchError } from "../common/middleware/catch-error.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as projectController from "./project.controller";
import * as projectValidator from "./project.validation";
// import { roleAuth } from "../common/middleware/role-auth.middleware";
import { uploadProjectFiles } from "../common/middleware/upload.middleware";

const router = Router();
console.log("Project routes loaded");

router.post(
    "/create",
    roleAuth(["ADMIN"]),
    uploadProjectFiles,
    projectValidator.createProject,
    catchError,
    projectController.createProject
);

router.get("/all", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);
router.patch(
    "/update/:id",
    roleAuth(["ADMIN"]),
    uploadProjectFiles,
    projectValidator.updateProject,
    catchError,
    projectController.updateProject
);

router.delete(
    "/delete/:id",
    roleAuth(["ADMIN"]),
    projectController.deleteProject
);

export default router;
