import { Session } from "../models/Session.js";
import { User } from "../models/User.js";
import { TokenSuite } from "../lib/TokenSuites/TokenSuite.js";
import {
  CreateSession,
  SessionRepository,
} from "../repositories/SessionRepository.js";

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
}
