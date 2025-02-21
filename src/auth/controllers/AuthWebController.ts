import { AuthenticationService } from "../services/AuthenticationService.js";
import { Request, Response } from "express";
import {
  UserCredentialsInput,
  UserCredentialsValidator,
} from "../validation/AuthenticationValidation.js";
import createHttpError, { HttpError } from "http-errors";
import {
  AuthenticationException,
  ConflictException,
  NotFoundException,
  RepositoryException,
  ValidationException,
} from "../exceptions.js";

export class AuthWebController {
  constructor(private authenticationService: AuthenticationService) {}

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
}
