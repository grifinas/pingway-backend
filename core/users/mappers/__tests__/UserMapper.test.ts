import { UserMapper } from "@core/users/mappers/impl/UserMapper";
import { User, UserModel } from "@core/users/models";

const testUser: User = {
  userId: "testUserId",
  email: "testUserEmail",
  isVerified: false,
};
const testUserModel: UserModel = {
  UserId: "testUserId",
  Email: "testUserEmail",
  IsVerified: false,
};

describe("User Mapper", () => {
  describe("#toModel()", () => {
    it("should map to user model type", () => {
      expect(UserMapper.toModel(testUser)).toEqual(testUserModel);
    });
  });

  describe("#toDto()", () => {
    it("should map to user dto type", () => {
      expect(UserMapper.toDto(testUserModel)).toEqual(testUser);
    });
  });
});
