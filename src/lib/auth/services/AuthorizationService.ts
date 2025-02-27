import {
  AuthorizationException,
  ForbiddenException,
  NotFoundException,
} from "../exceptions.js";
import { Session } from "../models/Session.js";
import { User } from "../models/User.js";
import { SessionService } from "./SessionService.js";
import { UserService } from "./UserService.js";

export interface Authorization {
  user: User;
  session: Session;
}

export class AuthorizationService {
  constructor(
    private sessionService: SessionService,
    private userService: UserService
  ) {}

  /** Deletes a Session without a user, doesn't error. */
  private async deleteUncoupledSession(session: Session): Promise<null> {
    try {
      await this.sessionService.deleteSessionByToken(session.token);
    } catch (err) {
      if (!(err instanceof NotFoundException)) {
        throw err;
      }
    }
    return null;
  }

  public async checkAuthorization(
    token: string,
    permission?: string
  ): Promise<Authorization> {
    let session: Session;
    try {
      session = await this.sessionService.findSessionByToken(token);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new AuthorizationException();
      }
      throw err;
    }

    let user: User;
    try {
      user = await this.userService.findUserById(session.userId);
    } catch (err) {
      if (!(err instanceof NotFoundException)) {
        throw err;
      }
      // The session exists, but the associated User doesn't.
      await this.deleteUncoupledSession(session);
      throw new AuthorizationException();
    }

    if (
      typeof permission !== "undefined" &&
      !this.userService.checkPermission(user, permission)
    ) {
      throw new ForbiddenException();
    }

    return { user, session };
  }
}
