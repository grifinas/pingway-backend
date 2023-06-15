import { User } from "@core/users/models";

export interface IUsersFacade {
  getUserById(id: string): Promise<User | null>;
}
