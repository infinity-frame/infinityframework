import { Session } from "../models/Session.js";
import { UserCredentialsInput } from "../validation/AuthenticationValidation.js";
import { SessionService } from "./SessionService.js";
import { UserService } from "./UserService.js";

export class AuthenticationService {
  constructor(
    private userService: UserService,
    private sessionService: SessionService
  ) {}

  public async authenticateUsernamePassword(
    userCredentials: UserCredentialsInput
  ): Promise<Session> {
    const user = await this.userService.verifyCredentials(userCredentials);
    const session = await this.sessionService.createSession(user);

    return session;
  }
}
