import SharedBase from "../shared/shared.base";
import {
  Subscription,
  SubscriptionCreationAttributes,
  SubscriptionDocument,
} from "../../models";

interface SubscriptionDataInterface {
  createUser(
    data: SubscriptionCreationAttributes
  ): Promise<SubscriptionDocument | undefined>;
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

  public async createUser(
    data: SubscriptionCreationAttributes
  ): Promise<SubscriptionDocument | undefined> {
    try {
      const subscription = await Subscription.create(data);
      return subscription;
    } catch (error) {
      this.generateError(error);
    }
  }
}

export default SubscriptionData;
