import { AlphaNumericRegex } from "../regexes.js";
import {
  AuthenticationException,
  NotFoundException,
  ValidationException,
} from "../exceptions.js";
import { HashSuite } from "../lib/HashSuites/HashSuite.js";
import { User } from "../models/User.js";
import { CreateUser, UserRepository } from "../repositories/UserRepository.js";
import { UserCredentialsInput } from "../validation/AuthenticationValidation.js";
import { CreateUserInput } from "../validation/UserValidation.js";
import { z } from "zod";

export const PasswordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

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
      throw new AuthenticationException();
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

  public async createUser(createUserInput: CreateUserInput): Promise<User> {
    const usernameValidation = z
      .string()
      .min(3)
      .regex(AlphaNumericRegex)
      .safeParse(createUserInput.username);
    if (!usernameValidation.success) {
      throw new ValidationException(
        usernameValidation.error.issues,
        "Username must be at least 3 characters."
      );
    }

    const passwordValidation = z
      .string()
      .regex(PasswordRegex)
      .safeParse(createUserInput.password);
    if (!passwordValidation.success) {
      throw new ValidationException(
        passwordValidation.error.issues,
        "Password must be at least 8 characters with at least 1 uppercase, lowercase, digit and special character."
      );
    }
    const passwordHash = await this.passwordHashSuite.hash(
      createUserInput.password
    );

    const createUser: CreateUser = {
      username: createUserInput.username,
      passwordHash,
    };
    const user = await this.userRepository.create(createUser);

    return user;
  }

  public async findUserById(id: string): Promise<User> {
    const user = (await this.userRepository.find({ id }))[0];
    if (typeof user === "undefined") {
      throw new NotFoundException();
    }

    return user;
  }
}
