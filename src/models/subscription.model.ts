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

enum Status {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

interface SubscriptionCreationAttributes {
  name: string;
  price: string;
  currency: Currency;
  category: Category;
  paymentMethod: string;
  status: Status;

  startDate: {
    type: Date;
    required: true;
    validate: {
      validator: (value: Date) => boolean;
      message: string;
    };
  };

  renewalDate: {
    type: Date;
    validate: {
      validator: (value: Date) => boolean;
      message: string;
    };
  };

  user: {
    type: typeof mongoose.Schema.Types.ObjectId;
    ref: string;
  };
}

const subscriptionSchema = new mongoose.Schema(
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
        validator: function (value) {
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
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }

  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
