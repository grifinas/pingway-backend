import { User, UserModel } from "@core/users/models/User";

export interface IUserMapper {
  toModel(dto: User): UserModel;
  toDto(model: UserModel): User;
}
