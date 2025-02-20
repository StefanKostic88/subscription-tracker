import { Request, Response } from "express";

import {
  SubscriptionCreationAttributes,
  SubscriptionCreationWithoutUser,
} from "../../models/subscription.model";

import { subscriptionService } from "../../services";

import { catchAyncError } from "../../helpers";
import { workflowClient } from "../../config/upstash";
import { SERVER_URL } from "../../config/env";

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

    // trigger the workflow

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: response.data.subscription?.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    res.status(201).json({ ...response, workflowRunId });
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
