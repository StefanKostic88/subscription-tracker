import { Router, Request, Response } from "express";
import { getAllUsers } from "../controlers";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", (req: Request, res: Response) => {
  res.send({
    test: "test",
  });
});

export default userRouter;
