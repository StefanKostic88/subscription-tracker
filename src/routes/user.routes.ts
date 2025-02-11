import { Router, Request, Response } from "express";

const userRouter = Router();

userRouter.get("/", (req: Request, res: Response) => {
  res.send({
    test: "test",
  });
});
userRouter.get("/:id", (req: Request, res: Response) => {
  res.send({
    test: "test",
  });
});

export default userRouter;
