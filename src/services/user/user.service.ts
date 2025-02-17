import mongoose from "mongoose";
import UserData from "../../base/user/user.data";
import { CustomError } from "../../helpers";
import { SignInUser, UserCreationAttributes, UserDocument } from "../../models";

import JwtService from "../JWT/jwt.service";
import { EmailService, EmailStatus } from "../email/email.service";

enum AuthRequestMethod {
  SIGN_IN = "sign in",
}

enum UserReponseMessage {
  USER_CREATED = "User created successfully",
  USER_SIGNED_IN = "User Signed in successfully",
}

interface UserResponse {
  data: { token: string | null; user: UserDocument | null };
  message: UserReponseMessage;
  success: boolean;
}

class UserService {
  private static instance: UserService;
  private userData: UserData;
  private jwtService: JwtService;
  private emailService: EmailService;
  private userDocument: UserDocument | null;
  private constructor() {
    this.userData = UserData.getInstance();
    this.jwtService = JwtService.getInstance();
    this.emailService = EmailService.getInstance();
    this.userDocument = null;
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
    const user = await this.userData.createUser(data, session);
    const token = user && (await this.jwtService.create(user.id));

    return this.generateUserResponse(
      { user, token },
      UserReponseMessage.USER_CREATED
    );
  }

  public async getUser() {
    const user = this.userDocument;
    const token = user && (await this.jwtService.create(user.id));

    return this.generateUserResponse(
      { user, token },
      UserReponseMessage.USER_SIGNED_IN
    );
  }

  public async checkIfRegisteredEmailExists(
    data: UserCreationAttributes
  ): Promise<this> {
    return this.checkEmailStatus(data.email, EmailStatus.USER_REGISTERED);
  }

  public async checkIfUserEixsts(data: SignInUser): Promise<this> {
    this.checkIfRequestIsValid(data, AuthRequestMethod.SIGN_IN);
    return this.checkEmailStatus(data.email, EmailStatus.USER_NOT_FOUND);
  }

  public async checkUserPasword(password: string) {
    const isPasswordValid = await this.userDocument?.checkPassword(password);
    if (!isPasswordValid) {
      throw new CustomError("Password not valid", 401);
    }

    return this;
  }

  private checkIfRequestIsValid(
    data: SignInUser,
    requestType: AuthRequestMethod
  ): boolean {
    const { password, email } = data;

    if (requestType === AuthRequestMethod.SIGN_IN && (!password || !email)) {
      throw new CustomError(
        "Invalid Request Data: Password and Email are required",
        401
      );
    }
    return true;
  }

  private async checkEmailStatus(
    email: string,
    checkType: EmailStatus
  ): Promise<this> {
    const user = await this.userData.getUserByEmail(email);
    const emailStatus = this.generateStatus(email);

    if (checkType === EmailStatus.USER_REGISTERED && user) {
      emailStatus[EmailStatus.USER_REGISTERED]();
    }

    if (checkType === EmailStatus.USER_NOT_FOUND && !user) {
      emailStatus[EmailStatus.USER_NOT_FOUND]();
    }
    this.userDocument = user;
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

  private generateUserResponse(
    data: {
      token: string | null | undefined;
      user: UserDocument | null | undefined;
    },
    responseType: UserReponseMessage
  ): UserResponse | undefined {
    const userResponse = { data: { ...data }, success: true };

    if (responseType === UserReponseMessage.USER_CREATED) {
      return {
        ...userResponse,
        message: UserReponseMessage.USER_CREATED,
      } as UserResponse;
    }
    if (responseType === UserReponseMessage.USER_SIGNED_IN) {
      return {
        ...userResponse,
        message: UserReponseMessage.USER_SIGNED_IN,
      } as UserResponse;
    }
  }
}

export default UserService;
