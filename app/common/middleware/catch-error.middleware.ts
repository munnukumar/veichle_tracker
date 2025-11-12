import { validationResult } from "express-validator";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";

export const catchError = expressAsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const isError = errors.isEmpty();

    console.log("Validation Errors:", errors.array());
    console.log("Validation Errors:", isError);


    if (!isError) {
      console.log("Validation errors found");
      const data = { errors: errors.array() };
      throw createHttpError(400, {
        message: "Validation error!",
        data,
      });
    } else {
      next();
    }
  }
);
