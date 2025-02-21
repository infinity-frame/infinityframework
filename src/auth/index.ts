import { RequestHandler, Router } from "express";
import { AuthWebController } from "./controllers/AuthWebController.js";
import { MongoSessionRepository } from "./repositories/SessionRepository.js";
import { AuthRouterFactory } from "./routers/AuthRouter.js";
import { AuthenticationService } from "./services/AuthenticationService.js";
import { SessionService } from "./services/SessionService.js";
import { UserService } from "./services/UserService.js";
import { Db } from "mongodb";
import { AuthMiddlewareFactory } from "./middleware/AuthMiddleware.js";
import { BcryptHashSuite } from "./lib/HashSuites/bcrypt.js";
import { MongoUserRepository } from "./repositories/UserRepository.js";
import { Sha512TokenSuite } from "./lib/TokenSuites/Sha512TokenSuite.js";
import { AuthCliController } from "./controllers/AuthCliController.js";
import { RunCliFactory } from "./cli/AuthCli.js";
import { AuthorizationService } from "./services/AuthorizationService.js";

/** Primary loader for the auth module */

interface Auth {
  router: Router;
  middleware: RequestHandler;
}

type AuthCli = () => Promise<undefined>;

/** Lib dependencies */
const passwordHashSuite = new BcryptHashSuite();
const tokenHashSuite = new Sha512TokenSuite();

/** Loads the auth and returns a new auth router and middleware. */
export const LoadAuthModule = (db: Db): Auth => {
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
  const authorizationService = new AuthorizationService(
    sessionService,
    userService
  );

  /** Controller */
  const authController = new AuthWebController(
    authenticationService,
    authorizationService
  );

  return {
    router: AuthRouterFactory(authController),
    middleware: AuthMiddlewareFactory(authController),
  };
};

export const LoadAuthCli = (db: Db): AuthCli => {
  /** Repositories */
  const userRepository = new MongoUserRepository(db);

  /** Services */
  const userService = new UserService(userRepository, passwordHashSuite);

  /** Controller */
  const authController = new AuthCliController(userService);

  return RunCliFactory(authController);
};
