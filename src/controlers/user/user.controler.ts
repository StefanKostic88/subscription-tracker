import { Request, Response, NextFunction } from "express";
import { userService } from "../../services";
import { User } from "../../models";
import { catchAyncError } from "../../helpers";

export const getAllUsers = catchAyncError(
  async (req: Request, res: Response) => {
    const response = await userService.getAllUsers();
    res.status(200).json(response);
  }
);
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      throw new Error("User not found"); // 404
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
