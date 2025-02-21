import { UserService } from "../services/UserService.js";
import { input } from "@inquirer/prompts";

export class AuthCliController {
  constructor(private userService: UserService) {}

  public async createUser(): Promise<null> {
    const username = await input({ message: "Enter a username: " });
    const password = await input({ message: "Enter a password: " });

    const userView = await this.userService.createUser({ username, password });
    console.log(`Created a User
        Id: ${userView.id}
        Username: ${userView.username}
        Creation timestamp: ${userView.createdAt}`);

    return null;
  }
}
