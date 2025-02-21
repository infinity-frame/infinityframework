import crypto from "crypto";
import { TokenSuite } from "./TokenSuite.js";

export class Sha512TokenSuite implements TokenSuite {
  constructor(private readonly seedSize: number = 16) {}

  generateToken(payload?: object): string {
    const seed = crypto.randomBytes(this.seedSize);
    const token = crypto.hash("sha512", seed);
    return token;
  }
}
