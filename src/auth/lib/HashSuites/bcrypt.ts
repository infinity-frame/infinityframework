import bcrypt from "bcrypt";
import { HashSuite } from "./HashSuite.js";

export class BcryptHashSuite implements HashSuite {
  constructor(private readonly saltRounds: number = 10) {}

  public hash(inp: string): Promise<string> {
    return bcrypt.hash(inp, this.saltRounds);
  }

  public compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
