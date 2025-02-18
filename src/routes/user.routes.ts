import { Router } from "express";
import { getAllUsers, getUser } from "../controlers";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUser);

export default userRouter;
