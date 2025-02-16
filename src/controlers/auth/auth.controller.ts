import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { UserCreationAttributes, SignInUser, User } from "../../models";
// import { CustomError } from "../../helpers";
// import { JwtService, BcryptService } from "../../services";
import UserService from "../../services/user/user.service";
import { CustomError } from "../../helpers";
import bcrypt from "bcrypt";

// const bCrypt = BcryptService.getInstance();
// const jwtService = JwtService.getInstance();
const userService = UserService.getInstance();

export const signUp = async (
  req: Request<object, object, UserCreationAttributes>,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password, name } = req.body;

    // const existingUser = await User.findOne({ email: email });

    // if (existingUser) {
    //   const error = new CustomError("User exists", 409);
    //   throw error;
    // }

    const responseData = await (
      await userService.checkIfRegisteredEmailExists({ email, password, name })
    ).createUser({ email, password, name }, session);

    // const hashedPassword = await bCrypt.encryptPassword(password);

    // const newUsers = await User.create(
    //   [
    //     {
    //       name,
    //       email,
    //       password: hashedPassword,
    //     },
    //   ],
    //   { session: session }
    // );

    // const newUser = newUsers[0];

    // const token = await jwtService.create(newUser.id);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(responseData);
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    // next(error);
    // console.log(error);
    // next(new Error("ERRORRR"));
    next(new CustomError(error.message, error.statusCode));
  }
};

export const signIn = async (
  req: Request<object, object, SignInUser>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new CustomError("Password not valid", 401);
    }

    // const token =  generate token

    res.status(200).json({
      data: {
        token: "",
        user,
      },
      message: "User Signd in successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};
