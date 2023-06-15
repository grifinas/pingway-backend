import { usersRepository } from "@core/users/repositories";
import { logger } from "@common/lambda/tools/logger";
import { UsersService } from "@core/users/services/impl/UsersService";

export const usersService = new UsersService(logger, usersRepository);
