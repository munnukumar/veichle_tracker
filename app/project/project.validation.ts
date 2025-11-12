// src/modules/projects/project.validation.ts

import { body } from "express-validator";

export const createProject = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price")
        .isNumeric()
        .withMessage("Price must be a number")
        .notEmpty()
        .withMessage("Price is required"),
];

export const updateProject = [
    body("title").optional().isString().withMessage("Title must be a string"),
    body("description").optional().isString(),
    body("price").optional().isNumeric(),
    body("category").optional().isString(),
];
