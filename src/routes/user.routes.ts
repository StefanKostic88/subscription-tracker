import { Router } from "express";
import { getAllUsers, getUser } from "../controlers";
import { userAuthenticated } from "../middlewares";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", userAuthenticated, getUser);

export default userRouter;
