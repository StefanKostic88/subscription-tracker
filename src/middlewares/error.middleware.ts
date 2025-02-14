import { NextFunction, Request, Response } from "express";
import { CustomError } from "../helpers";

export const unsupportedRoutes = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorMessage = `Unsupported route, Cant find ${req.originalUrl}`;
  next(new CustomError(errorMessage, 404));
};

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let error = { ...err };

    if (err.name === "CastError") {
      const message = "Resource not found";
      error = new CustomError(message, 404);
    }

    if (err.statusCode === 11000) {
      const message = "Duplicate field value entered";
      error = new CustomError(message, 400);
    }

    if (err.name === "ValidationError") {
      const messsage = Object.values(err.errors).map(
        (val) => (val as { message: string }).message
      );

      error = new CustomError(messsage.join(", "), 400);
    }

    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  } catch (error) {
    next(error);
  }
};
