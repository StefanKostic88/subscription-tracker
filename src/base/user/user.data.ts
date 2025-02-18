import SharedBase from "../shared/shared.base";
import { User, UserDocument } from "../../models";
import { CustomError } from "../../helpers";

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

  // User
  ///////////////////////

  public async getAllUsers(): Promise<UserDocument[]> {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw this.generateError(error);
    }
  }

  public async getUserById(id: string) {
    try {
      const user = await User.findById(id).select("-password");
      if (!user) {
        throw new CustomError(
          `User not found, user with id: ${id} does not exist`,
          404
        );
      }
      return user;
    } catch (error) {
      throw this.generateError(error);
    }
  }
}

export default UserData;
