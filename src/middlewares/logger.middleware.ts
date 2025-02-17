import { NextFunction, Response, Request } from "express";
import { infoLogger } from "../services";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startLogging = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startLogging;
    console.log(duration);
    infoLogger.info(`${req.method} ${req.originalUrl} - ${duration}ms`);
  });

  next();
};
