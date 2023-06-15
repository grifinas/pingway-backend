import { makeApiGatewayLambdaHandler } from "@common/lambda/helpers/handler";
import { extractAuthorizerUser } from "@common/lambda/helpers/authorizer";
import { documentClient } from "@common/dynamodb/documentClient";
import {
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { PingReminderModel, PingReminderType } from "@core/pings/models";
import { v4 as uuidv4 } from "uuid";
import { mapToDynamoDocument } from "@common/dynamodb/utils/mapToDynamoDocument";
import { logger } from "@common/lambda/tools/logger";

const generateId = async () => uuidv4();

export const handler = makeApiGatewayLambdaHandler(async (event) => {
  const { userId } = extractAuthorizerUser(event);
  const { dateTime, type } = event.body;
  const pingId = event.pathParameters?.pingId!;

  const PingReminderId = await generateId();

  const item: PingReminderModel = {
    PingId: pingId,
    UserId: userId,
    DateTime: dateTime,
    Type: type as PingReminderType,
    IsSent: false,
    PingReminderId,
  };

  const params: PutItemCommandInput = {
    TableName: process.env.PING_REMINDERS_TABLE,
    Item: mapToDynamoDocument({
      ...item,
    }),
  };

  logger.info(
    `Performing PUT Item command for reminder ${PingReminderId}`,
    JSON.stringify(params)
  );

  const res: PutItemCommandOutput = await documentClient.send(
    new PutItemCommand(params)
  );

  logger.info(`Response ----->  `, JSON.stringify(res));

  return {
    statusCode: 201,
    body: "",
  };
});
