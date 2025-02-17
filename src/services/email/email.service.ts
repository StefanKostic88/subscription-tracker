import { CustomError } from "../../helpers";

export enum EmailStatus {
  USER_REGISTERED = "registered",
  USER_NOT_FOUND = "Not found",
}

export class EmailService {
  private static instance: EmailService;

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }

    return EmailService.instance;
  }

  public generateEmailStatus(email: string): {
    [key in EmailStatus]: () => void;
  } {
    const emailStatus = {
      [EmailStatus.USER_REGISTERED]: () =>
        this.checkEmailStatus(email, EmailStatus.USER_REGISTERED),
      [EmailStatus.USER_NOT_FOUND]: () =>
        this.checkEmailStatus(email, EmailStatus.USER_NOT_FOUND),
    };

    return emailStatus;
  }

  private checkEmailStatus(email: string, checkType: EmailStatus) {
    let errorMessage: string;
    let statusCode: number;

    switch (checkType) {
      case EmailStatus.USER_REGISTERED:
        errorMessage = `User with email: ${email} exists, please use other email`;
        statusCode = 409;
        break;
      case EmailStatus.USER_NOT_FOUND:
        errorMessage = `User not found, User with email: ${email} doesn't exist`;
        statusCode = 404;
        break;
      default:
        throw new CustomError("Unknown email status type", 400);
    }

    throw new CustomError(errorMessage, statusCode);
  }
}
