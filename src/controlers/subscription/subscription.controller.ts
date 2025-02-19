import { Request, Response, NextFunction } from "express";

import {
  SubscriptionCreationAttributes,
  SubscriptionCreationWithoutUser,
} from "../../models/subscription.model";

import { subscriptionService } from "../../services";

import { catchAyncError } from "../../helpers";

export const createSubscription = catchAyncError(
  async (
    req: Request<object, object, SubscriptionCreationWithoutUser>,
    res: Response
  ) => {
    const data: SubscriptionCreationAttributes = {
      ...req.body,
      user: req.currentUser?.id,
    };

    const response = await subscriptionService.createUser(data);

    res.status(201).json(response);
  }
);

export const getUserSubscriptions = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.id;

  try {
    if (req.currentUser?.id !== userId) {
      const errpr = new Error("You are not the owner of this account");
      // errpr.status = 401;

      throw errpr;
    }

    // const subs = await SUb.find({ user: req.params.id });

    res.send("data");
  } catch (error) {
    next(error);
  }
};
