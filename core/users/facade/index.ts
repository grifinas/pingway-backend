import { UsersFacade } from "@core/users/facade/impl/UsersFacade";
import { usersRepository } from "@core/users/repositories";
import { usersService } from "@core/users/services";

export const usersFacade = new UsersFacade(usersRepository, usersService);
