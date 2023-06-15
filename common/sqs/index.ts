import { SQSClient } from "@aws-sdk/client-sqs";
import { Environment } from "@common/env/Environment";
import { MessageQueueServiceClient } from "@common/sqs/SQSClient";
import { configService } from "@common/config";

export type { IMessageQueueServiceClient } from "./SQSClient";

export type { IMessageHandler } from "./IMessageHandler";

const sqsClient = new SQSClient({ region: Environment.REGION });

export const messageQueueServiceClient = new MessageQueueServiceClient(
  sqsClient,
  configService
);
