import createHttpError from "http-errors";
import {
  CreateSessionDTO,
  CreateUserDTO,
  SessionDTO,
  SessionFilterOptions,
  UpdateSessionDTO,
  UpdateUserDTO,
  UserCredentialsDTO,
  UserDTO,
  UserFilterOptions,
  UserSensitiveDTO,
} from "./authValidation.js";
import { Repository, TokenSuite } from "./repositories/Repository.js";
import { HashSuite } from "./lib/HashSuites/types.js";

export class AuthController {
  constructor(
    public UserRepository: Repository<
      UserSensitiveDTO,
      CreateUserDTO,
      UpdateUserDTO,
      UserFilterOptions
    >,
    public SessionRepository: Repository<
      SessionDTO,
      CreateSessionDTO,
      UpdateSessionDTO,
      SessionFilterOptions
    >,
    public PasswordHashSuite: HashSuite,
    public SessionTokenHashSuite: TokenSuite
  ) {}

  public async authenticate(
    userCredentials: UserCredentialsDTO
  ): Promise<SessionDTO> {
    const user = (
      await this.UserRepository.find({ username: userCredentials.username })
    )[0];
    if (!user) {
      throw createHttpError(400, "Username or password were incorrect.", {
        code: "ERR_AUTHENTICATION",
      });
    }

    if (
      !this.PasswordHashSuite.compare(
        userCredentials.password,
        user.passwordHash
      )
    ) {
      throw createHttpError(400, "Username or password were incorrect.", {
        code: "ERR_AUTHENTICATION",
      });
    }

    return await this.createSession(user);
  }

  private async createSession(userDto: UserDTO): Promise<SessionDTO> {
    const token = this.SessionTokenHashSuite.generateToken();

    return await this.SessionRepository.create({
      token,
      userId: userDto._id,
    });
  }
}
