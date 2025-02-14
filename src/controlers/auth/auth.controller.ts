import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User, { UserCreationAttributes } from "../../models/user.model";
import { CustomError } from "../../helpers";

import { JwtService, BcryptService } from "../../services";

const bCrypt = BcryptService.getInstance();
const jwtService = JwtService.getInstance();

export const signUp = async (
  req: Request<object, object, UserCreationAttributes>,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  console.log(req.body);

  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const error = new CustomError("User exists", 409);
      throw error;
    }

    const hashedPassword = await bCrypt.encryptPassword(password);

    const newUsers = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session: session }
    );

    const newUser = newUsers[0];

    const token = await jwtService.createUser(newUser.id);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      data: {
        token,
        user: newUser,
      },
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // next(error);
    next(new Error("ERRORRR"));
    console.log(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};
