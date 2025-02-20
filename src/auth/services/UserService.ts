import { AuthenticationException, NotFoundException } from "../exceptions.js";
import { HashSuite } from "../lib/HashSuites/HashSuite.js";
import { User } from "../models/User.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { UserCredentialsInput } from "../validation/AuthenticationValidation.js";

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private passwordHashSuite: HashSuite
  ) {}

  public async verifyCredentials(
    userCredentials: UserCredentialsInput
  ): Promise<User> {
    const user = (
      await this.userRepository.find({ username: userCredentials.username })
    )[0];
    if (typeof user === "undefined") {
      throw new NotFoundException();
    }

    if (
      !(await this.passwordHashSuite.compare(
        userCredentials.password,
        user.passwordHash
      ))
    ) {
      throw new AuthenticationException();
    }

    return user;
  }
}
