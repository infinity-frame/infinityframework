import { AuthCliController } from "../controllers/AuthCliController.js";
import { select } from "@inquirer/prompts";
import { RepositoryException } from "../exceptions.js";

export function RunCliFactory(
  authCliController: AuthCliController
): () => Promise<undefined> {
  return async () => {
    while (true) {
      const command = await select({
        message: "Select a command",
        choices: [
          {
            name: "Create a User",
            value: "createUser",
            description: "Creates a User.",
          },
          {
            name: "Exit",
            value: "exit",
            description: "Ends the CLI session.",
          },
        ],
      });

      try {
        switch (command) {
          case "createUser":
            await authCliController.createUser();
            break;
          case "exit":
            console.info("Exiting CLI session...");
            return;
          default:
            console.error("No command specified.");
            break;
        }
      } catch (err) {
        console.error(err);
        if (err instanceof RepositoryException) {
          console.error("Encountered FATAL exception.");
          return;
        }
      }
    }
  };
}
