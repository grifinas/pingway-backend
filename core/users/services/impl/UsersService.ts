import { Logger } from "@aws-lambda-powertools/logger";
import { User } from "@core/users/models";
import { IUsersRepository } from "@core/users/repositories";

export class UsersService {
  constructor(
    private logger: Logger,
    private usersRepository: IUsersRepository
  ) {}

  async addUser(user: User) {
    try {
      this.logger.info(`Adding user with params:`, user);
      await this.usersRepository.addUser(user);
      this.logger.info(`Added user with params:`, user);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          "Failed to handle user post confirmation event",
          error
        );
      } else {
        this.logger.error(
          "Unknown error handling user post confirmation event",
          JSON.stringify(error)
        );
      }
    }
  }
}
