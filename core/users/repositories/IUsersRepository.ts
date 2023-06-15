import { User } from "@core/users/models/User";

export interface IUsersRepository {
  addUser: (user: User) => Promise<void>;
  getUserById: (userId: string) => Promise<User | null>;
}
