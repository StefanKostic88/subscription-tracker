import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { UserCreationAttributes, SignInUser } from "../../models";
import { UserService } from "../../services";
import { catchAsyncErrorWithCommit, catchAyncError } from "../../helpers";

const userService = UserService.getInstance();

export const signUp = catchAsyncErrorWithCommit(
  async (
    req: Request<object, object, UserCreationAttributes>,
    res: Response,
    next: NextFunction,
    session: mongoose.ClientSession
  ) => {
    const { email, password, name } = req.body;

    const responseData = await (
      await userService.checkIfRegisteredEmailExists({ email, password, name })
    ).createUser({ email, password, name }, session);

    res.status(200).json(responseData);
  }
);

export const signIn = catchAyncError(
  async (req: Request<object, object, SignInUser>, res: Response) => {
    const { email, password } = req.body;

    const responseData = await (
      await (
        await userService.checkIfUserEixsts({ email, password })
      ).checkUserPasword(password)
    ).getUser();

    res.status(200).json(responseData);
  }
);

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};
