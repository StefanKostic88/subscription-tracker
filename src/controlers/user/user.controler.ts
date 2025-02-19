import { Request, Response, NextFunction } from "express";
import { userService } from "../../services";
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
    const response = await userService.getUserById(req.params.id);

    // Try to use this, functio which should use this first, and if fail call the getUserById method
    const userTest = req.currentUser;
    console.log(userTest);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
