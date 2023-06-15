import {
  UpdateCommand,
  UpdateCommandInput,
  ScanCommand,
  ScanCommandInput,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

import { PingReminder, PingReminderModel } from "@core/pings/models";
import { logger } from "@common/lambda/tools/logger";
import { PingReminderMapper } from "@core/pings/mappers/impl/PingReminderMapper";
import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { mapToDynamoDocument } from "@common/dynamodb/utils/mapToDynamoDocument";
import { v4 as uuidv4 } from "uuid";
import { IConfigService } from "@common/config/IConfigService";
import { IPingRemindersRepository } from "@core/pings/repositories/IPingRemindersRepository";

export class PingRemindersRepository implements IPingRemindersRepository {
  private pingRemindersTableName: string;

  constructor(
    private documentClient: DynamoDBDocumentClient,
    private configService: IConfigService
  ) {
    this.pingRemindersTableName = this.configService.get(
      "PING_REMINDERS_TABLE"
    );
  }

  nextIdentity(): string {
    return uuidv4();
  }

  async addReminders(reminders: PingReminder[]): Promise<void> {
    const reminderItems = reminders.map((reminder) =>
      PingReminderMapper.toModel(reminder)
    );

    const params: BatchWriteItemCommandInput = {
      RequestItems: {
        [this.pingRemindersTableName]: reminderItems.map((reminder) => ({
          PutRequest: {
            Item: mapToDynamoDocument(reminder),
          },
        })),
      },
    };

    logger.info(
      `Performing batch write command for reminders`,
      JSON.stringify(params)
    );
    const result = await this.documentClient.send(
      new BatchWriteItemCommand(params)
    );
    logger.info(
      `Performed batch write command for reminders`,
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

  async getUnsentReminders(): Promise<PingReminder[]> {
    const params: ScanCommandInput = {
      TableName: this.pingRemindersTableName,
      FilterExpression: "#DateTime <= :CurrentDateTime and #IsSent = :IsSent",
      ExpressionAttributeNames: {
        "#DateTime": "DateTime",
        "#IsSent": "IsSent",
      },
      ExpressionAttributeValues: {
        ":CurrentDateTime": new Date().toISOString(),
        ":IsSent": false,
      },
    };

    logger.info(
      `Querying pings for processing with params: ${JSON.stringify(params)}`
    );

    const { Items, ...result } = await this.documentClient.send(
      new ScanCommand(params)
    );

    logger.info(
      `Queried pings for processing, found ${Items?.length || 0} items`,
      JSON.stringify(result)
    );

    const items = Object.values(Items || []) as PingReminderModel[];
    return items.map(PingReminderMapper.toDto);
  }
}
