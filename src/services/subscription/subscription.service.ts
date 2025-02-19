import { SubscriptionData } from "../../base";
import { CustomError } from "../../helpers";
import {
  SubscriptionCreationAttributes,
  SubscriptionDocument,
} from "../../models";

enum UserReponseMessage {
  SUB_CREATED = "Subscription created successfully",
}

interface ServiceResponse<T> {
  data: T;
  message?: string;
  length?: number;
  success: boolean;
}

interface SubscriptionResponseData {
  subscription: SubscriptionDocument | undefined;
}

type SubscriptionResponse = ServiceResponse<SubscriptionResponseData>;

interface SubscriptionServiceInterface {
  createSubscription(
    data: SubscriptionCreationAttributes
  ): Promise<SubscriptionResponse>;
}

class SubscriptionService implements SubscriptionServiceInterface {
  public static instance: SubscriptionService;
  private subscriptionData: SubscriptionData;
  private constructor() {
    this.subscriptionData = SubscriptionData.getInstance();
  }

  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }

    return SubscriptionService.instance;
  }
  public async createSubscription(
    data: SubscriptionCreationAttributes
  ): Promise<SubscriptionResponse> {
    const subscription = await this.subscriptionData.createSubscription(data);

    const response = this.generateResponse(
      { subscription },
      UserReponseMessage.SUB_CREATED
    );
    return response;
  }

  public async geteSubscriptionByUserName(userId: string) {
    const subscriptions =
      await this.subscriptionData.geteSubscriptionByUserName(userId);

    return this.generateResponse(
      { subscriptions },
      undefined,
      subscriptions ? subscriptions.length : 0
    );
  }

  public checkIfUserIsValid(data: { paramsId: string; userId: string }) {
    const { paramsId, userId } = data;

    if (userId !== paramsId) {
      throw new CustomError("You are not the owner of this account", 401);
    }

    return this;
  }

  private generateResponse<T>(data: T, responseMsg?: string, length?: number) {
    return {
      success: true,
      ...(responseMsg && { message: responseMsg }),
      ...(length && { length: length }),
      data,
    };
  }
}

const subscriptionService = SubscriptionService.getInstance();

export default subscriptionService;
