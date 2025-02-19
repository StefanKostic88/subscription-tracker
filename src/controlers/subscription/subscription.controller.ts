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

    const response = await subscriptionService.createSubscription(data);

    res.status(201).json(response);
  }
);

export const getUserSubscriptions = catchAyncError(
  async (req: Request, res: Response) => {
    const paramsId = req.params.id;
    const userId = req.currentUser?.id;

    const data = {
      paramsId,
      userId: userId as string,
    };

    const response = await subscriptionService
      .checkIfUserIsValid(data)
      .geteSubscriptionByUserName(userId);

    res.status(200).json(response);
  }
);
