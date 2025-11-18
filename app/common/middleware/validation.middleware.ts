// app/common/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw createHttpError(400, {
            message: "Validation error!",
            data: { errors: errors.array() },
        });
    }

    return next();
};
