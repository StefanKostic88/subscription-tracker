import { Request, Response, NextFunction } from "express";
import { userService } from "../../services";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await userService.getAllUsers();

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
