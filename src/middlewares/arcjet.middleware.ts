import aj from "../config/arcjet";
import { Request, Response, NextFunction } from "express";

export const arcjetMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decision = await aj.protect(req, { requested: 5 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({ error: "Bot detected" });
      }

      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Arcjet Middleware Error: ${error.message}`);
    }
    next(error);
  }
};
