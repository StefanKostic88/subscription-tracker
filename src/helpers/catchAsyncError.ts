import mongoose from "mongoose";

const catchAsyncError = <Req, Res, N>(
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
        console.error("Error during transaction:", err);
        (next as (err: Error) => void)(err);
      }
    } finally {
      session.endSession();
    }
  };
};

export default catchAsyncError;
