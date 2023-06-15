import { User } from "@core/users/models";

export interface IUsersService {
  addUser(user: User): Promise<void>;
}
