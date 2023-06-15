import {
  QueryCommand,
  UpdateCommand,
  QueryCommandInput,
  UpdateCommandInput,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

import { PingMapper } from "@core/pings/mappers/impl/PingMapper";
import { Ping, PingModel, PingReminderModel } from "@core/pings/models";
import { IPingsRepository } from "@core/pings/repositories/IPingsRepository";
import { logger } from "@common/lambda/tools/logger";
import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { mapToDynamoDocument } from "@common/dynamodb/utils/mapToDynamoDocument";
import { PING_REMINDERS_TABLE_USER_PING_GSI } from "@core/pings/constants/indexes";
import { v4 as uuidv4 } from "uuid";
import { IConfigService } from "@common/config/IConfigService";

export class PingsRepository implements IPingsRepository {
  private pingsTableName: string;
  private pingRemindersTableName: string;

  constructor(
    private documentClient: DynamoDBDocumentClient,
    private configService: IConfigService
  ) {
    this.pingsTableName = this.configService.get("PINGS_TABLE");
    this.pingRemindersTableName = this.configService.get(
      "PING_REMINDERS_TABLE"
    );
  }

  nextIdentity(): string {
    return uuidv4();
  }

  async nextReminderIdentity(): Promise<string> {
    return uuidv4();
  }

  async addPing(ping: Ping): Promise<void> {
    const { Reminders: reminderItems, ...pingItem } = PingMapper.toModel(ping);

    const params: BatchWriteItemCommandInput = {
      RequestItems: {
        [this.pingsTableName]: [
          {
            PutRequest: {
              Item: mapToDynamoDocument(pingItem),
            },
          },
        ],
        [this.pingRemindersTableName]: reminderItems.map((reminder) => ({
          PutRequest: {
            Item: mapToDynamoDocument(reminder),
          },
        })),
      },
    };

    logger.info(
      `Performing batch write command for pings`,
      JSON.stringify(params)
    );
    const result = await this.documentClient.send(
      new BatchWriteItemCommand(params)
    );
    logger.info(
      `Performed batch write command for pings`,
      JSON.stringify(result)
    );
  }

  async markReminderAsSent(pingId: string, reminderId: string): Promise<void> {
    const params: UpdateCommandInput = {
      TableName: this.pingRemindersTableName,
      Key: {
        PingReminderId: reminderId,
        PingId: pingId,
      },
      UpdateExpression: `set IsSent = :IsSent`,
      ExpressionAttributeValues: {
        ":IsSent": true,
      },
    };

    logger.info(
      `Performing mark as sent update command for reminder`,
      JSON.stringify(params)
    );

    const result = await this.documentClient.send(new UpdateCommand(params));

    logger.info(
      `Performed mark as sent update command for reminder`,
      JSON.stringify(result)
    );
  }

  async getCurrentPings(filter: Pick<Ping, "userId">): Promise<Ping[]> {
    const params: QueryCommandInput = {
      TableName: this.pingsTableName,
      KeyConditionExpression: "#UserId = :UserId",
      FilterExpression: "#DateTime > :CurrentDateTime",
      ExpressionAttributeNames: {
        "#UserId": "UserId",
        "#DateTime": "DateTime",
      },
      ExpressionAttributeValues: {
        ":CurrentDateTime": new Date().toISOString(),
        ":UserId": filter.userId!,
      },
    };

    logger.info(`Querying pings with params`, JSON.stringify(params));

    const { Items: pingItems, ...pingsQueryResult } =
      await this.documentClient.send(new QueryCommand(params));

    logger.info(
      `Queried pings, found ${pingItems?.length || 0}`,
      JSON.stringify(pingsQueryResult)
    );

    const remindersParamsInput: QueryCommandInput = {
      TableName: this.pingRemindersTableName,
      IndexName: PING_REMINDERS_TABLE_USER_PING_GSI,
      KeyConditionExpression: "#UserId = :UserId",
      ExpressionAttributeNames: {
        "#UserId": "UserId",
      },
      ExpressionAttributeValues: {
        ":UserId": filter.userId!,
      },
    };

    logger.info(
      `Querying reminders with params`,
      JSON.stringify(remindersParamsInput)
    );

    const { Items: reminderItems, ...remindersQueryResult } =
      await this.documentClient.send(new QueryCommand(remindersParamsInput));

    logger.info(
      `Queried reminders, found ${reminderItems?.length || 0}`,
      JSON.stringify(pingsQueryResult)
    );

    const pings = Object.values(pingItems || []) as PingModel[];
    const reminders = Object.values(reminderItems || []) as PingReminderModel[];

    const remindersByPingId = reminders.reduce(
      (remindersMap, reminder) => ({
        ...remindersMap,
        [reminder.PingId]: (remindersMap[reminder.PingId] || []).concat(
          reminder
        ),
      }),
      {} as Record<string, PingReminderModel[]>
    );

    return pings.map((ping) =>
      PingMapper.toDto(ping, remindersByPingId[ping.PingId])
    );
  }

  async getPingById(id: string, userId: string): Promise<Ping | null> {
    const params: QueryCommandInput = {
      TableName: this.pingsTableName,
      KeyConditionExpression: "#UserId = :UserId and #PingId = :PingId",
      ExpressionAttributeNames: {
        "#UserId": "UserId",
        "#PingId": "PingId",
      },
      ExpressionAttributeValues: {
        ":PingId": id,
        ":UserId": userId,
      },
    };

    logger.info(`Querying ping with params`, JSON.stringify(params));

    const { Items, ...result } = await this.documentClient.send(
      new QueryCommand(params)
    );

    logger.info(
      `Queried ping, found results: ${Items?.length || 0}`,
      JSON.stringify(result)
    );

    const [ping] = Object.values(Items || []) as PingModel[];
    return ping ? PingMapper.toDto(ping, []) : null;
  }
}
