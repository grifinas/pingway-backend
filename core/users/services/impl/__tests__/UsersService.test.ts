import { logger } from "@common/lambda/tools/logger";
import { User } from "@core/users/models";
import { IUsersRepository } from "@core/users/repositories";
import { UsersService } from "@core/users/services/impl/UsersService";

const usersRepository: IUsersRepository = {
  addUser: jest.fn(),
  getUserById: jest.fn(),
};

describe("Users service", () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService(logger, usersRepository);
  });

  describe("#addUser()", () => {
    it("should call users repository with the user", async () => {
      const user = {} as User;

      await service.addUser(user);

      expect(usersRepository.addUser).toBeCalledWith(user);
    });
  });
});
