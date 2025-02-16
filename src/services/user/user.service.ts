import mongoose from "mongoose";
import UserData from "../../base/user/user.data";
import { CustomError } from "../../helpers";
import { UserCreationAttributes } from "../../models";
import BcryptService from "../b-crypt/bCrypt.service";
import JwtService from "../JWT/jwt.service";
import { EmailService, EmailStatus } from "../email/email.service";

class UserService {
  private static instance: UserService;
  private userData: UserData;
  private bCrypt: BcryptService;
  private jwtService: JwtService;
  private emailService: EmailService;
  private constructor() {
    this.userData = UserData.getInstance();
    this.bCrypt = BcryptService.getInstance();
    this.jwtService = JwtService.getInstance();
    this.emailService = EmailService.getInstance();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
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

  public async checkIfRegisteredEmailExists(
    data: UserCreationAttributes
  ): Promise<this> {
    this.checkIfRequestIsValid(data);
    return this.checkEmailStatus(data.email, EmailStatus.USER_REGISTERED);
  }

  public async checkIfUserEixsts(email: string): Promise<this> {
    return this.checkEmailStatus(email, EmailStatus.USER_NOT_FOUND);
  }

  private checkIfRequestIsValid(data: UserCreationAttributes) {
    const { email, name, password } = data;

    if (!email || !name || !password) {
      throw new CustomError("Invalid Request Data", 401);
    }

    return true;
  }

  private async checkEmailStatus(
    email: string,
    checkType: EmailStatus
  ): Promise<this> {
    const user = await this.userData.getUserByEmail(email);
    const emailStatus = this.generateStatus(email);

    if (EmailStatus.USER_REGISTERED && user) {
      emailStatus[EmailStatus.USER_REGISTERED]();
    }

    if (checkType === EmailStatus.USER_NOT_FOUND && !user) {
      emailStatus[EmailStatus.USER_NOT_FOUND]();
    }
    return this;
  }

  private generateStatus(email: string): { [key in EmailStatus]: () => void } {
    const emailStatus = {
      [EmailStatus.USER_REGISTERED]: () =>
        this.emailService.checkEmailStatus(email, EmailStatus.USER_REGISTERED),
      [EmailStatus.USER_NOT_FOUND]: () =>
        this.emailService.checkEmailStatus(email, EmailStatus.USER_NOT_FOUND),
    };

    return emailStatus;
  }
}

export default UserService;
