import { JWT_SECRET } from "../../config/env";
import jwt from "jsonwebtoken";
import { CustomError } from "../../helpers";

class JwtService {
  private secret: string;
  private expiresIn = "1d" as const;

  public static instance: JwtService;
  private constructor() {
    this.secret = JWT_SECRET;
  }

  public static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }

    return JwtService.instance;
  }

  public create(user_id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { user_id },
        this.secret,
        { expiresIn: this.expiresIn },
        function (err, token) {
          if (err || !token) {
            return reject(
              new CustomError(`Error while creating token: ${err}`, 401)
            );
          }
          resolve(token);
        }
      );
    });
  }

  public verify(token: string): Promise<{ user_id: string }> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, function (err, decoded) {
        if (err) {
          return reject(
            new CustomError(`Error while decoding token: ${err}`, 401)
          );
        }

        resolve(decoded as { user_id: string });
      });
    });
  }
}

export default JwtService;
