/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { CustomError } from "../../helpers";

class SharedBase {
  public generateError(error: unknown): CustomError {
    if (error instanceof Error && error.message.includes("E11000")) {
      return this.handleDuplicateDB(error);
    }
    if (error instanceof Error && error.name === "CastError") {
      return this.handleCastError(error);
    }

    if (error instanceof mongoose.Error) {
      if (error.name === "ValidationError") {
        return this.handleValidationError(error);
      }
    }

    if (error instanceof CustomError) {
      return new CustomError(error.message, error.statusCode);
    }

    return new CustomError((error as Error).message, 500);
  }

  private handleValidationError(error: mongoose.Error): CustomError {
    const errorArray = Object.values(
      (error as mongoose.Error.ValidationError).errors
    );

    const message = errorArray.map((er) => er.message).join(", ");
    return new CustomError(message, 400);
  }

  private handleDuplicateDB(err: any): CustomError {
    const value: string = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const errorMsg = `Duplicate Field value: ${value}, please use another value`;

    return new CustomError(errorMsg, 400);
  }

  private handleCastError(err: any): CustomError {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new CustomError(message, 404);
  }
}

export default SharedBase;
