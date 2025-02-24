import UserData from "../../base/user/user.data";

import { UserDocument } from "../../models";

interface allUsersResponse {
  allUsers: UserDocument[];
}

interface singleUserResponse {
  user: UserDocument;
}

interface ServiceResponse<T> {
  data: T;
  message?: string;
  length?: number;
  success: boolean;
}

type AllUsersServiceReponse = ServiceResponse<allUsersResponse>;
type SingleUserServiceReponse = ServiceResponse<singleUserResponse>;

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

  public async getAllUsers(): Promise<AllUsersServiceReponse> {
    const allUsers = await this.userData.getAllUsers();
    return this.generateResponse(
      { allUsers },
      undefined,
      allUsers ? allUsers.length : 0
    );
  }

  public async getUserById(id: string): Promise<SingleUserServiceReponse> {
    const user = await this.userData.getUserById(id);

    return this.generateResponse({ user });
  }

  private generateResponse<T>(data: T, responseMsg?: string, length?: number) {
    return {
      success: true,
      ...(responseMsg && { message: responseMsg }),
      ...(length && { length: length }),
      data,
    };
  }
}

const userService = UserService.getInstance();

export default userService;
