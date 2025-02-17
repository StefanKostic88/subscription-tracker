import mongoose from "mongoose";
import { bcryptService } from "../services";

export interface SignInUser {
  email: string;
  password: string;
}

export interface UserCreationAttributes extends SignInUser {
  name: string;
}

type UserSchema = UserCreationAttributes;
// createdAt: Date;
// lastUpdate?: Date;

interface UserMethods {
  encriptPassword: () => Promise<string>;
  checkPassword: (candidatePass: string) => Promise<boolean>;
}

export interface UserDocument
  extends mongoose.Document<UserSchema, object, UserSchema>,
    UserSchema,
    UserMethods {}

interface UserModel
  extends mongoose.Model<
    UserDocument,
    object,
    UserMethods,
    object,
    UserDocument
  > {
  myStatic: () => void;
}

const userSchema = new mongoose.Schema<UserSchema, UserModel, UserMethods>(
  {
    name: {
      type: String,
      required: [true, "User Name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User Password is required"],
      minLength: 6,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      this.password = await bcryptService.encryptPassword(this.password);
    } catch (error) {
      return next(error as Error);
    }
  }

  next();
});

userSchema.method("encriptPassword", async function () {
  return await bcryptService.encryptPassword(this.password);
});

userSchema.method("checkPassword", async function (candidatePass: string) {
  const isPasswordCorrect: boolean = await bcryptService.comparePasswords(
    candidatePass,
    this.password
  );

  return isPasswordCorrect;
});

export const User = mongoose.model<UserSchema, UserModel>("User", userSchema);
