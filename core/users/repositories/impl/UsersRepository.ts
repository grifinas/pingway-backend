import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { Environment } from "@common/env/Environment";
import { logger } from "@common/lambda/tools/logger";
import { IConfigService } from "@common/config/IConfigService";
import { UserMapper } from "@core/users/mappers";
import { User, UserModel } from "@core/users/models";
import { IUsersRepository } from "@core/users/repositories/IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private usersTableName: string;

  constructor(
    private documentClient: DynamoDBDocumentClient,
    private configService: IConfigService
  ) {
    this.usersTableName = this.configService.get("USERS_TABLE");
  }

  async addUser(user: User) {
    const params = {
      TableName: this.usersTableName,
      Item: UserMapper.toModel(user),
    };

    await this.documentClient.send(new PutCommand(params));
  }

  async getUserById(userId: string): Promise<User | null> {
    const params: QueryCommandInput = {
      TableName: this.usersTableName,
      KeyConditionExpression: "#UserId = :UserId",
      ExpressionAttributeNames: {
        "#UserId": "UserId",
      },
      ExpressionAttributeValues: {
        ":UserId": userId,
      },
    };

    logger.info(`Querying users with params`, params);

    const result = await this.documentClient.send(new QueryCommand(params));

    const [user] = Object.values(result.Items || []) as UserModel[];
    return user ? UserMapper.toDto(user) : null;
  }
}
