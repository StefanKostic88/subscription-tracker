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
    const allUsers = await this.userData.getAllUsers();
    return this.generateResponse(
      { usersLength: allUsers ? allUsers.length : 0, allUsers },
      "All Users"
    );
  }

  private generateResponse<T>(data: T, responseMsg: string) {
    return {
      success: true,
      message: responseMsg,
      data,
    };
  }
}

const userService = UserService.getInstance();

export default userService;
