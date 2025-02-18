import UserData from "../../base/user/user.data";

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

  public async getUserById() {}

  public async getAllUsers() {
    return await this.userData.getAllUsers();
  }
}

const userService = UserService.getInstance();

export default userService;
