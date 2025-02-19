import { Request, Response } from "express";

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
