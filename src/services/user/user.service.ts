import mongoose from "mongoose";
import UserData from "../../base/user/user.data";
import { CustomError } from "../../helpers";
import { UserCreationAttributes } from "../../models";
import BcryptService from "../b-crypt/bCrypt.service";
import JwtService from "../JWT/jwt.service";

class UserService {
  private static instance: UserService;
  private userData: UserData;
  private bCrypt: BcryptService;
  private jwtService: JwtService;
  private constructor() {
    this.userData = UserData.getInstance();
    this.bCrypt = BcryptService.getInstance();
    this.jwtService = JwtService.getInstance();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  public async checkIfUserEixsts(email: string): Promise<this> {
    const user = await this.userData.getUserByEmail(email);

    if (user) {
      throw new CustomError(`User with email: ${user.email} exists`, 409);
    }

    return this;
  }

  public async createUser(
    data: UserCreationAttributes,
    session: mongoose.mongo.ClientSession
  ) {
    try {
      const hashedPassword = await this.bCrypt.encryptPassword(data.password);
      const hashedPasswordUser: UserCreationAttributes = {
        ...data,
        password: hashedPassword,
      };
      const user = await this.userData.createUser(hashedPasswordUser, session);
      const token = user && (await this.jwtService.create(user.id));

      const responseData = {
        data: {
          token,
          user,
        },
        success: true,
        message: "User created successfully",
      };

      return responseData;
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserService;
