import SharedBase from "../shared/shared.base";
import {
  Subscription,
  SubscriptionCreationAttributes,
  SubscriptionDocument,
} from "../../models";

interface SubscriptionDataInterface {
  createSubscription(
    data: SubscriptionCreationAttributes
  ): Promise<SubscriptionDocument | undefined>;

  geteSubscriptionByUserName(userId: string): Promise<SubscriptionDocument[]>;
}

class SubscriptionData extends SharedBase implements SubscriptionDataInterface {
  private static instance: SubscriptionData;
  private constructor() {
    super();
  }

  public static getInstance(): SubscriptionData {
    if (!SubscriptionData.instance) {
      SubscriptionData.instance = new SubscriptionData();
    }

    return SubscriptionData.instance;
  }

  public async createSubscription(
    data: SubscriptionCreationAttributes
  ): Promise<SubscriptionDocument | undefined> {
    try {
      const subscription = await Subscription.create(data);
      return subscription;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  public async geteSubscriptionByUserName(
    userId: string
  ): Promise<SubscriptionDocument[]> {
    try {
      const subscription = await Subscription.find({ user: userId });
      return subscription;
    } catch (error) {
      throw this.generateError(error);
    }
  }
}

export default SubscriptionData;
