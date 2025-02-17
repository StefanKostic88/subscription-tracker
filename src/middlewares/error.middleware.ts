import { Request, Response, NextFunction } from "express";
import { CustomError } from "../helpers";

export const unsupportedRoutes = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorMessage = `Unsupported route, Cant find route: ${req.originalUrl}`;
  next(new CustomError(errorMessage, 404));
};
export const errorHandlerMiddleware = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  res.status(err.statusCode).json({
    data: null,
    error: {
      message: err.message,
    },
  });
};
