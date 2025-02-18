import mongoose from "mongoose";
import { AuthData } from "../../base";
import JwtService from "../JWT/jwt.service";
import { UserCreationAttributes, UserDocument } from "../../models";
import { EmailService } from "../email/email.service";
import { CustomError } from "../../helpers";

enum AuthResctriction {
  INVALID_PASS = "Password not valid",
  INVALID_REQ = "Invalid Request Data: Password and Email are required",
}

enum UserReponseMessage {
  USER_CREATED = "User created successfully",
  USER_SIGNED_IN = "User signed in successfully",
}

interface ServiceResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface UserAuthResponseData {
  user?: UserDocument | null;
  token?: string | null;
}

type UserAuthResponse = ServiceResponse<UserAuthResponseData>;

class AuthService {
  private static instance: AuthService;
  private authData: AuthData;
  private jwtService: JwtService;
  private emailService: EmailService;

  private constructor() {
    this.authData = AuthData.getInstance();
    this.jwtService = JwtService.getInstance();
    this.emailService = EmailService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  public async signUpUser(
    data: UserCreationAttributes,
    session: mongoose.mongo.ClientSession
  ): Promise<UserAuthResponse> {
    const user = await this.authData.createUser(data, session);

    const token = user && (await this.jwtService.create(user.id));

    return this.generateUserResponse(
      { user, token },
      UserReponseMessage.USER_CREATED
    );
  }

  public async signInUser(data: {
    email: string;
    password: string;
  }): Promise<UserAuthResponse> {
    this.passAndEmailAreRequiredCheck(data);

    const { email, password } = data;

    const user = await this.authData.getUserByEmail(email);

    if (!user) {
      this.emailService.userEmailNotFound(email);
    }

    const isPasswordValid = await user?.checkPassword(password);

    if (!isPasswordValid) {
      throw this.authFaild(AuthResctriction.INVALID_PASS, 401);
    }

    const token = user && (await this.jwtService.create(user.id));
    return this.generateUserResponse(
      { user, token },
      UserReponseMessage.USER_SIGNED_IN
    );
  }

  // PRIVATE METHODS
  // Export this to common class
  private generateUserResponse<T>(
    data: T,
    responseMsg: string
  ): ServiceResponse<T> {
    return {
      success: true,
      message: responseMsg,
      data,
    };
  }

  private passAndEmailAreRequiredCheck(data: {
    email: string;
    password: string;
  }): void {
    const { email, password } = data;

    if (!password || !email) {
      throw this.authFaild(AuthResctriction.INVALID_REQ, 401);
    }
  }

  private authFaild(
    checkType: AuthResctriction,
    statuCode: number
  ): CustomError {
    return new CustomError(checkType, statuCode);
  }
}

const authService = AuthService.getInstance();

export default authService;
