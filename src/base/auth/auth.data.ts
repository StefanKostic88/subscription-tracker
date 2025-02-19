import SharedBase from "../shared/shared.base";
import { User, UserCreationAttributes, UserDocument } from "../../models";
import mongoose from "mongoose";

class AuthData extends SharedBase {
  private static instance: AuthData;
  private constructor() {
    super();
  }

  public static getInstance(): AuthData {
    if (!AuthData.instance) {
      AuthData.instance = new AuthData();
    }

    return AuthData.instance;
  }

  // Auth
  ////////////////////////
  public async createUser(
    user: UserCreationAttributes,
    session: mongoose.mongo.ClientSession
  ): Promise<UserDocument | undefined> {
    try {
      const newUsers = await User.create([user], { session });
      const newUser = newUsers[0];
      return newUser;
    } catch (error) {
      throw this.generateError(error);
    }
  }

  public async getUserByEmail(email: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw this.generateError(error);
    }
  }
}

export default AuthData;
