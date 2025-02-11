import { Router, Request, Response } from "express";

const authRouter = Router();

authRouter.post("/sign-up", (req: Request, res: Response) => {
  res.send({
    test: "test",
  });
});
authRouter.post("/sign-in", (req: Request, res: Response) => {
  res.send({
    test: "test",
  });
});
authRouter.post("/sign-out", (req: Request, res: Response) => {
  res.send({
    test: "test",
  });
});

export default authRouter;
