import { NextFunction, Request, Response } from "express";
import Subscription from "../../models/subscription.model";
import { SubscriptionCreationAttributes } from "../../models/subscription.model";

export const createSubscription = (
  req: Request<object, object, SubscriptionCreationAttributes>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.currentUser);

    const data = req.body;
    console.log(data);
    const {name, category,currency,frequency} = data;
    // const subscription = await Subscription.create(req.body, user: req.user_id);

    res.send("CAO");
  } catch (error) {
    next(error);
  }
};
