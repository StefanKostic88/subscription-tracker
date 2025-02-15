import SharedBase from "../shared/shared.base";
import { User, UserCreationAttributes } from "../../models";
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
  ) {
    try {
      const users = await User.create([User], { session });
      const user = users[0];
      return user;
    } catch (error) {
      console.error(error);
      this.generateError(error);
    }
  }
}

export default UserData;
