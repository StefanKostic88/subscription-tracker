import mongoose from "mongoose";

interface UserCreationAttributes {
  name: string;
  email: string;
  password: string;
}

type UserSchema = UserCreationAttributes;
// createdAt: Date;
// lastUpdate?: Date;

interface UserMethods {
  test: () => void;
}

interface UserDocument
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
      required: [true, "User Name is required"],
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

const User = mongoose.model<UserSchema, UserModel>("User", userSchema);

export default User;
