import { IUsersFacade } from "@core/users/facade/IUsersFacade";
import { User } from "@core/users/models";
import { IUsersRepository } from "@core/users/repositories";
import { IUsersService } from "@core/users/services/IUsersService";

export class UsersFacade implements IUsersFacade {
  constructor(
    private usersRepository: IUsersRepository,
    private usersService: IUsersService
  ) {}

  getUserById(userId: string): Promise<User | null> {
    return this.usersRepository.getUserById(userId);
  }

  addUser(user: User): Promise<void> {
    return this.usersService.addUser(user);
  }
}
