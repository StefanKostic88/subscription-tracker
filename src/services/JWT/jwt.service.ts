import { JWT_SECRET } from "../../config/env";

class JwtService {
  private secret: string;

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

  public createUser () {}

  public verify () {}
}

export default JwtService;
