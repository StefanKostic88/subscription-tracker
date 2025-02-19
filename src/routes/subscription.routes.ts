import { Router, Request, Response } from "express";
import { createSubscription, getUserSubscriptions } from "../controlers";
import { userAuthenticated } from "../middlewares";

const subscriptionRouter = Router();

subscriptionRouter.post("/", userAuthenticated, createSubscription);

subscriptionRouter.get("/user:id", getUserSubscriptions);

export default subscriptionRouter;
