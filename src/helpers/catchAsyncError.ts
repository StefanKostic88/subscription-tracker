import mongoose from "mongoose";

export const catchAyncError = <Req, Res, N>(
  callback: (req: Req, Res: Res, next: N) => Promise<void>
) => {
  return (req: Req, res: Res, next: N) => {
    callback(req, res, next).catch((err: Error) => {
      if (err instanceof Error) {
        (next as (err: Error) => void)(err);
      }
    });
  };
};

export const catchAsyncErrorWithCommit = <Req, Res, N>(
  callback: (
    req: Req,
    res: Res,
    next: N,
    session: mongoose.ClientSession
  ) => Promise<void>
) => {
  return async (req: Req, res: Res, next: N) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await callback(req, res, next, session);

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();

      if (err instanceof Error) {
        (next as (err: Error) => void)(err);
      }
    } finally {
      session.endSession();
    }
  };
};
