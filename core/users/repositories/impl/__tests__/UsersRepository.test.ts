import {
  DynamoDBDocumentClient,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { IConfigService } from "@common/config/IConfigService";
import { UserMapper } from "@core/users/mappers/impl/UserMapper";
import { UsersRepository } from "@core/users/repositories/impl/UsersRepository";

describe("Users repository", () => {
  const mockDocumentClient = {
    send: jest.fn().mockImplementation(() => ({
      Items: {},
    })),
  };
  const mockConfigService = {
    get: jest.fn(),
  };

  let usersRepository: UsersRepository;

  beforeEach(() => {
    usersRepository = new UsersRepository(
      mockDocumentClient as unknown as DynamoDBDocumentClient,
      mockConfigService as IConfigService
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("#getUserById()", () => {
    it("should include user id in key condition expression", async () => {
      await usersRepository.getUserById("testUserId");

      const [[{ input }]] = mockDocumentClient.send.mock.calls;

      expect((input as QueryCommandInput).KeyConditionExpression).toBe(
        "#UserId = :UserId"
      );
    });

    it("should throw an error when document client rejects", async () => {
      mockDocumentClient.send.mockImplementation(() => {
        throw new Error();
      });

      await expect(usersRepository.getUserById("testUserId")).rejects.toThrow();
    });

    it("should return null when document client returns no results", async () => {
      mockDocumentClient.send.mockImplementation(async () => ({ Items: {} }));

      expect(await usersRepository.getUserById("testUserId")).toBe(null);
    });

    it("should use user mapper to map the resulting user", async () => {
      const userMapperSpy = jest.spyOn(UserMapper, "toDto");
      const dbUser = {
        UserId: "testUserId",
      };

      mockDocumentClient.send.mockImplementation(async () => ({
        Items: {
          [dbUser.UserId]: dbUser,
        },
      }));

      await usersRepository.getUserById("testUserId");

      expect(userMapperSpy).toHaveBeenCalledWith(dbUser);
    });
  });
});
