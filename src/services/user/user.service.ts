import UserData from "../../base/user/user.data";
import { CustomError } from "../../helpers";
import { UserCreationAttributes } from "../../models";

class UserService {
  private static instance: UserService;
  private userData: UserData;

  private constructor() {
    this.userData = UserData.getInstance();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  public async checkIfUserEixsts(email: string) {
    const user = await this.userData.getUserByEmail(email);

    if (user) {
      throw new CustomError(`User with email: ${user.email} exists`, 409);
    }

    return this;
  }
}

export default UserService;
