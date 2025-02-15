import SharedBase from "../shared/shared.base";
import { User, UserCreationAttributes, UserDocument } from "../../models";
import mongoose from "mongoose";

class UserData extends SharedBase {
  private static instance: UserData;
  private constructor() {
    super();
  }

  public static getInstance(): UserData {
    if (!UserData.instance) {
      UserData.instance = new UserData();
    }

    return UserData.instance;
  }

  public async createUser(
    user: UserCreationAttributes,
    session: mongoose.mongo.ClientSession
  ): Promise<UserDocument | undefined> {
    try {
      const users = await User.create([User], { session });
      const user = users[0];
      return user;
    } catch (error) {
      console.error(error);
      throw this.generateError(error);
    }
  }

  public async getUserByEmail(email: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      console.error(error);
      throw this.generateError(error);
    }
  }
}

export default UserData;
