import {
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { StorePingCommand } from "@core/pings/events/StorePingCommand";
import { ReminderReachedDueDate } from "@core/pings/events/ReminderReachedDueDate";
import { ReminderMarkedSent } from "@core/pings/events/ReminderMarkedSent";
import { IConfigService } from "@common/config/IConfigService";
export {
  SendMessageCommand,
  SendMessageCommandInput,
} from "@aws-sdk/client-sqs";

export interface IMessageQueueServiceClient {
  sendMessage: (
    command: StorePingCommand | ReminderReachedDueDate | ReminderMarkedSent
  ) => Promise<void>;
}

export class MessageQueueServiceClient implements IMessageQueueServiceClient {
  private addPingsQueueUrl: string;
  private remindersQueueUrl: string;
  private remindersMarkedSentQueueUrl: string;

  constructor(
    private sqsClient: SQSClient,
    private configService: IConfigService
  ) {
    this.addPingsQueueUrl = this.configService.get("ADD_PING_QUEUE_URL");
    this.remindersQueueUrl = this.configService.get("REMINDERS_QUEUE_URL");
    this.remindersMarkedSentQueueUrl = this.configService.get(
      "REMINDERS_MARKED_SENT_QUEUE_URL"
    );
  }

  async sendMessage(
    command: StorePingCommand | ReminderReachedDueDate | ReminderMarkedSent
  ): Promise<void> {
    const queueUrl = this.getQueueUrl(command);

    await this.sqsClient.send(
      new SendMessageCommand({
        MessageBody: JSON.stringify(command),
        QueueUrl: queueUrl,
      } as SendMessageCommandInput)
    );
  }

  private getQueueUrl(
    command: StorePingCommand | ReminderReachedDueDate | ReminderMarkedSent
  ) {
    if (command instanceof StorePingCommand) {
      return this.addPingsQueueUrl;
    }

    if (command instanceof ReminderReachedDueDate) {
      return this.remindersQueueUrl;
    }

    return this.remindersMarkedSentQueueUrl;
  }
}
