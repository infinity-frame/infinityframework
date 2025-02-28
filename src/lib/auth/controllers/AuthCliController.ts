import { UserService } from "../services/UserService.js";
import { input } from "@inquirer/prompts";

export class AuthCliController {
  constructor(private userService: UserService) {}

  public async createUser(): Promise<null> {
    const username = await input({ message: "Enter a username:" });
    const password = await input({ message: "Enter a password:" });
    const permissions = (
      await input({
        message: "Enter permissions (comma-separated):",
      })
    ).split(",");

    const userView = await this.userService.createUser({
      username,
      password,
      permissions,
    });
    console.log(
      `Created a User\nId: ${userView.id}\nUsername: ${userView.username}\nCreation timestamp: ${userView.createdAt}\nPermissions: ${userView.permissions}`
    );

    return null;
  }
}
