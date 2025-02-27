import { AuthenticationService } from "../services/AuthenticationService.js";
import { Request, Response } from "express";
import {
  UserCredentialsInput,
  UserCredentialsValidator,
} from "../validation/AuthenticationValidation.js";
import createHttpError, { HttpError } from "http-errors";
import {
  AuthenticationException,
  AuthorizationException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  RepositoryException,
  ValidationException,
} from "../exceptions.js";
import { AuthorizationService } from "../services/AuthorizationService.js";
import { SessionService } from "../services/SessionService.js";
import { User } from "../models/User.js";

interface UserView {
  username: string;
  createdAt: string;
  id: string;
  permissions: string[];
}

export class AuthWebController {
  constructor(
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService,
    private sessionService: SessionService
  ) {}

  private mapUserToView(user: User): UserView {
    return {
      username: user.username,
      id: user.id,
      createdAt: user.createdAt.toISOString(),
      permissions: user.permissions,
    };
  }

  private mapExceptionToHttpError(err: unknown): HttpError {
    if (err instanceof RepositoryException) {
      return createHttpError(500, "Internal database error occured.");
    }
    if (err instanceof ConflictException) {
      return createHttpError(409, "Resource already exists.");
    }
    if (err instanceof NotFoundException) {
      return createHttpError(404, "Resource not found.");
    }
    if (err instanceof AuthenticationException) {
      return createHttpError(400, "User credentials provided were invalid.");
    }
    if (err instanceof ValidationException) {
      return createHttpError(400, "Validation error occured.", {
        issues: err.issues,
      });
    }
    if (err instanceof AuthorizationException) {
      return createHttpError(401);
    }
    if (err instanceof ForbiddenException) {
      return createHttpError(403);
    }

    return createHttpError(500, "Unexpected error occured", { err });
  }

  public async login(req: Request, res: Response) {
    try {
      const userCredentialsInput: UserCredentialsInput =
        UserCredentialsValidator(req.body);

      const session =
        await this.authenticationService.authenticateUsernamePassword(
          userCredentialsInput
        );

      res.status(201).send(session.token);
    } catch (err) {
      throw this.mapExceptionToHttpError(err);
    }
  }

  public async logout(req: Request, res: Response) {
    try {
      await this.sessionService.deleteSessionByToken(req.session.token);
      res.status(204).send();
    } catch (err) {
      throw this.mapExceptionToHttpError(err);
    }
  }

  public async identify(req: Request, res: Response) {
    try {
      const userView: UserView = this.mapUserToView(req.user);
      res.json(userView);
    } catch (err) {
      throw this.mapExceptionToHttpError(err);
    }
  }

  public async authorize(req: Request, res: Response, permission?: string) {
    try {
      const authorizationHeader = req.headers["authorization"];
      if (
        typeof authorizationHeader === "undefined" ||
        !authorizationHeader.startsWith("Bearer ")
      ) {
        throw new AuthorizationException();
      }
      const token = authorizationHeader.slice(7, authorizationHeader.length);

      const authorization = await this.authorizationService.checkAuthorization(
        token,
        permission
      );
      req.user = authorization.user;
      req.session = authorization.session;
    } catch (err) {
      throw this.mapExceptionToHttpError(err);
    }
  }
}
