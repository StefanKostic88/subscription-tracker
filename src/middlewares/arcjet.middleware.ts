import { arcjetPromise } from "../config/arcjet";
import { Request, Response, NextFunction } from "express";

export const arcjetMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const aj = await arcjetPromise;
    const decision = await aj.protect(req, { requested: 5 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.writeHead(429, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Rate limit exceeded" }));
        return;
      }
      if (decision.reason.isBot()) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Bot detected" }));
        return;
      }

      // return res.status(403).json({ error: "Access denied" });
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Access denied" }));
      return;
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Arcjet Middleware Error: ${error.message}`);
    }
    next(error);
  }
};
