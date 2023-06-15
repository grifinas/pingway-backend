import { IUserMapper } from "@core/users/mappers/IUserMapper";

export const UserMapper: IUserMapper = {
  toModel(dto) {
    return {
      UserId: dto.userId,
      Email: dto.email,
      IsVerified: dto.isVerified,
    };
  },
  toDto(model) {
    return {
      userId: model.UserId,
      email: model.Email,
      isVerified: model.IsVerified,
    };
  },
};
