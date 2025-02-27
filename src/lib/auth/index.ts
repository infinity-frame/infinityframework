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
import { MongoUserRepositoryFactory } from "./repositories/UserRepository.js";
import { Sha512TokenSuite } from "./lib/TokenSuites/Sha512TokenSuite.js";
import { AuthCliController } from "./controllers/AuthCliController.js";
import { RunCliFactory } from "./cli/AuthCli.js";
import { AuthorizationService } from "./services/AuthorizationService.js";
import { Logger } from "pino";
import { AppContext } from "../AppContext.js";

/** Primary loader for the auth module */

export interface Auth {
  router: Router;
  middleware: (permission?: string) => RequestHandler;
}

type AuthCli = () => Promise<undefined>;

/** Lib dependencies */
const passwordHashSuite = new BcryptHashSuite();
const tokenHashSuite = new Sha512TokenSuite();

/** Loads the auth and returns a new auth router and middleware. */
export const LoadAuthModule = async (
  db: Db,
  appContext: AppContext,
  logger: Logger
): Promise<Auth> => {
  /** Repositories */
  const sessionRepository = new MongoSessionRepository(db);
  const userRepository = await MongoUserRepositoryFactory(db);

  /** Services */
  const sessionService = new SessionService(sessionRepository, tokenHashSuite);
  const userService = new UserService(
    userRepository,
    passwordHashSuite,
    appContext
  );
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
    authorizationService,
    sessionService
  );

  const middlewareFactory = (permission?: string) => {
    return AuthMiddlewareFactory(authController, logger, permission);
  };

  return {
    router: AuthRouterFactory(authController, logger),
    middleware: middlewareFactory,
  };
};

export const LoadAuthCli = async (
  db: Db,
  appContext: AppContext
): Promise<AuthCli> => {
  /** Repositories */
  const userRepository = await MongoUserRepositoryFactory(db);

  /** Services */
  const userService = new UserService(
    userRepository,
    passwordHashSuite,
    appContext
  );

  /** Controller */
  const authController = new AuthCliController(userService);

  return RunCliFactory(authController);
};
