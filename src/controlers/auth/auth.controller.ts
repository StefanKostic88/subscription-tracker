import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { UserCreationAttributes, SignInUser } from "../../models";
import { authService } from "../../services";
import { catchAsyncErrorWithCommit, catchAyncError } from "../../helpers";

export const signUp = catchAsyncErrorWithCommit(
  async (
    req: Request<object, object, UserCreationAttributes>,
    res: Response,
    next: NextFunction,
    session: mongoose.ClientSession
  ) => {
    const { email, password, name } = req.body;

    const responseData = await authService.signUpUser(
      { email, password, name },
      session
    );

    res.status(201).json(responseData);
  }
);

export const signIn = catchAyncError(
  async (req: Request<object, object, SignInUser>, res: Response) => {
    const { email, password } = req.body;

    const responseData = await authService.signInUser({
      email,
      password,
    });

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
