import bcrypt from "bcrypt";

class BcryptService {
  public static instance: BcryptService;

  public static getInstance(): BcryptService {
    if (!BcryptService.instance) {
      BcryptService.instance = new BcryptService();
    }

    return BcryptService.instance;
  }

  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async comparePasswords(
    candidatePass: string,
    encodedPass: string
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePass, encodedPass);
  }
}

export default BcryptService;
