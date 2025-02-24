import mongoose from "mongoose";

enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

enum Frequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

enum Category {
  SPORTS = "sports",
  NEWS = "news",
  ENTERTAINMENT = "entertainment",
  LIFESTYLE = "lifestyle",
  TECHNOLOGY = "technology",
  FINANCE = "finance",
  POLITICS = "politics",
  OTHER = "other",
}

export enum Status {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

export interface SubscriptionCreationAttributes {
  name: string;
  price: number;
  frequency: Frequency;
  category: Category;
  paymentMethod: string;
  startDate: Date;

  user: {
    type: typeof mongoose.Schema.Types.ObjectId;
    ref: string;
  };

  currency?: Currency;
  status?: Status;
  renewalDate?: Date;
}

export type SubscriptionCreationWithoutUser = Omit<
  SubscriptionCreationAttributes,
  "user"
>;

type SubscriptionShema = SubscriptionCreationAttributes;

interface SubscriptionMethods {
  test: () => void;
}

export interface SubscriptionDocument
  extends mongoose.Document<SubscriptionShema, object, SubscriptionShema>,
    SubscriptionShema,
    SubscriptionMethods {}

interface SubscriptionModel
  extends mongoose.Model<
    SubscriptionDocument,
    object,
    SubscriptionMethods,
    object,
    SubscriptionDocument
  > {
  myStatic: () => void;
}

const subscriptionSchema = new mongoose.Schema<
  SubscriptionShema,
  SubscriptionModel,
  SubscriptionMethods
>(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Price must be greater than 0"],
    },
    currency: {
      type: String,
      enum: Currency,
      default: Currency.USD,
    },
    frequency: {
      type: String,
      enum: Frequency,
    },
    category: {
      type: String,
      enum: Category,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Status,
      default: Status.ACTIVE,
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods: { [key in Frequency]: number } = {
      [Frequency.DAILY]: 1,
      [Frequency.WEEKLY]: 7,
      [Frequency.MONTHLY]: 30,
      [Frequency.YEARLY]: 365,
    };
    this.renewalDate = new Date(this.startDate);

    const period = renewalPeriods[this.frequency as Frequency];
    this.renewalDate.setDate(this.renewalDate.getDate() + period);
  }

  if (this.renewalDate < new Date()) {
    this.status = Status.EXPIRED;
  }

  next();
});

export const Subscription = mongoose.model<
  SubscriptionShema,
  SubscriptionModel
>("Subscription", subscriptionSchema);
