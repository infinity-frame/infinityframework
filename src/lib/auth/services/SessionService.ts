import { Session } from "../models/Session.js";
import { User } from "../models/User.js";
import { TokenSuite } from "../lib/TokenSuites/TokenSuite.js";
import {
  CreateSession,
  SessionRepository,
} from "../repositories/SessionRepository.js";
import { NotFoundException } from "../exceptions.js";

export class SessionService {
  constructor(
    private sessionRepository: SessionRepository,
    private tokenSuite: TokenSuite
  ) {}

  public async createSession(user: User): Promise<Session> {
    const token = this.tokenSuite.generateToken();
    const createSession: CreateSession = { userId: user.id, token };

    return await this.sessionRepository.create(createSession);
  }

  public async findSessionByToken(token: string): Promise<Session> {
    const session = (await this.sessionRepository.find({ token }))[0];
    if (typeof session === "undefined") {
      throw new NotFoundException();
    }

    return session;
  }

  public async deleteSessionByToken(token: string): Promise<null> {
    const deletedCount = await this.sessionRepository.delete({ token });
    if (deletedCount === 0) {
      throw new NotFoundException();
    }

    return null;
  }
}
