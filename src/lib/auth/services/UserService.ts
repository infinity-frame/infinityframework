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
import { AppContext } from "../../AppContext.js";

export const PasswordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export class UserService {
  private validPermissions: string[];

  constructor(
    private userRepository: UserRepository,
    private passwordHashSuite: HashSuite,
    private appContext: AppContext
  ) {
    this.validPermissions = appContext.modules.map(
      (module) => `${module.config.vendor}.${module.config.name}`
    );
  }

  public checkPermission(user: User, permission: string): boolean {
    if (
      user.permissions.includes("global") ||
      user.permissions.includes(permission)
    ) {
      return true;
    }

    return false;
  }

  private checkPermissionExistence(permission: string): boolean {
    if (this.validPermissions.includes(permission) || permission === "global") {
      return true;
    }
    return false;
  }

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

    let permissions: string[] = [];
    if (typeof createUserInput.permissions !== "undefined") {
      if (
        !createUserInput.permissions.every((permission) =>
          this.checkPermissionExistence(permission)
        )
      )
        throw new ValidationException(
          [{ path: "permissions" }],
          "One of the permissions didn't exist."
        );
      permissions = createUserInput.permissions;
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
      permissions: createUserInput.permissions || [],
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
