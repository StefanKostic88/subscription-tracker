import { Router, Request, Response } from "express";
import { createSubscription } from "../controlers";
import { userAuthenticated } from "../middlewares";

const subscriptionRouter = Router();

subscriptionRouter.post("/", userAuthenticated, createSubscription);

export default subscriptionRouter;
