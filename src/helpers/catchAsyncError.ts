export const catchAsyncError = <Req, Res, N>(
  callback: (req: Req, res: Res, next: N) => Promise<void>
) => {
  return (req: Req, res: Res, next: N) => {
    callback(req, res, next).catch((err: Error) => {
      if (err instanceof Error) {
        (next as (err: Error) => void)(err);
      }
    });
  };
};
