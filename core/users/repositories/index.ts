import { documentClient } from "@common/dynamodb/documentClient";
import { configService } from "@common/config";
import { UsersRepository } from "@core/users/repositories/impl/UsersRepository";
export { IUsersRepository } from "@core/users/repositories/IUsersRepository";

export const usersRepository = new UsersRepository(
  documentClient,
  configService
);
