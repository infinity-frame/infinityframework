import { RequestHandler, Router } from "express";
import { AuthController } from "./controllers/AuthController.js";
import { MongoSessionRepository } from "./repositories/SessionRepository.js";
import { AuthRouterFactory } from "./routers/AuthRouter.js";
import { AuthenticationService } from "./services/AuthenticationService.js";
import { SessionService } from "./services/SessionService.js";
import { UserService } from "./services/UserService.js";
import { Db } from "mongodb";
import { AuthMiddlewareFactory } from "./middleware/AuthMiddleware.js";
import { BcryptHashSuite } from "./lib/HashSuites/bcrypt.js";
import { MongoUserRepository } from "./repositories/UserRepository.js";
import { Sha512TokenSuite } from "./lib/TokenSuites.ts/Sha512TokenSuite.js";

/** Primary loader for the auth module */

interface Auth {
  router: Router;
  middleware: RequestHandler;
}

/** Loads the auth and returns a new auth router and middleware. */
export const LoadAuthModule = (db: Db): Auth => {
  /** Lib dependencies */
  const passwordHashSuite = new BcryptHashSuite();
  const tokenHashSuite = new Sha512TokenSuite();

  /** Repositories */
  const sessionRepository = new MongoSessionRepository(db);
  const userRepository = new MongoUserRepository(db);

  /** Services */
  const sessionService = new SessionService(sessionRepository, tokenHashSuite);
  const userService = new UserService(userRepository, passwordHashSuite);
  const authenticationService = new AuthenticationService(
    userService,
    sessionService
  );

  /** Controller */
  const authController = new AuthController(authenticationService);

  return {
    router: AuthRouterFactory(authController),
    middleware: AuthMiddlewareFactory(authController),
  };
};
