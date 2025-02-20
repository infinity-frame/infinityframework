import { AuthenticationService } from "../services/AuthenticationService.js";
import { Request, Response } from "express";
import {
  UserCredentialsInput,
  UserCredentialsValidator,
} from "../validation/AuthenticationValidation.js";

export class AuthController {
  constructor(private authenticationService: AuthenticationService) {}

  public async login(req: Request, res: Response) {
    const userCredentialsInput: UserCredentialsInput = UserCredentialsValidator(
      req.body
    );

    const session =
      await this.authenticationService.authenticateUsernamePassword(
        userCredentialsInput
      );

    res.status(201).send(session.token);
  }
}
