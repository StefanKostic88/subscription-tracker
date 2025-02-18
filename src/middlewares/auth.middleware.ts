import { Request, Response, NextFunction } from "express";
import { CustomError } from "../helpers";
import { authService, userService } from "../services";

// Add catchAsync

export const userAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    const [tokenType, token] = authHeader?.split(" ") ?? ["", ""];
    if (!tokenType || !tokenType.startsWith("Bearer")) {
      return next(new CustomError(`User is not authorized`, 401));
    }

    const user_id = await authService.verifyToken(token);
    const {
      data: { user },
    } = await userService.getUserById(user_id);

    if (!user) {
      return next(new CustomError(`User is not authorized`, 401));
    }

    req.currentUser = user;

    next();
  } catch (error) {
    res
      .status(401)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .json({ message: "Unauthorized", error: (error as any).message });
  }
};
