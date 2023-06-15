import { Metrics, MetricUnits } from "@aws-lambda-powertools/metrics";
import { ObjectNotFoundError, IncorrectObjectError } from "@common/errors";
import { logger } from "@common/lambda/tools/logger";
import { IMessageQueueServiceClient } from "@common/sqs";
import { StorePingCommand } from "@core/pings/events/StorePingCommand";
import { NewPing, Ping } from "@core/pings/models";
import { IPingRemindersRepository } from "@core/pings/repositories/IPingRemindersRepository";
import { IPingsRepository } from "@core/pings/repositories/IPingsRepository";
import { IPingsService } from "@core/pings/services/IPingsService";

export class PingsService implements IPingsService {
  constructor(
    private metrics: Metrics,
    private mqClient: IMessageQueueServiceClient,
    private pingsRepository: IPingsRepository,
    private pingRemindersRepository: IPingRemindersRepository
  ) {}

  async getUserUnsentPings(userId: string): Promise<Ping[]> {
    try {
      const pings = await this.pingsRepository.getCurrentPings({ userId });
      return pings;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to retrieve usent pings: ${error.message}`);
      } else {
        logger.error(
          `Failed to retrieve usent pings: ${JSON.stringify(error)}`
        );
      }

      return [];
    }
  }

  async getUserPingById(pingId: string, userId: string): Promise<Ping | null> {
    try {
      const ping = await this.pingsRepository.getPingById(pingId, userId);
      if (!ping) {
        throw new ObjectNotFoundError();
      }

      return ping;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to get user ping by id: ${error.message}`);
      } else {
        logger.error(`Failed to get user ping by id: ${JSON.stringify(error)}`);
      }

      return null;
    }
  }

  async addPing(data: NewPing): Promise<Ping> {
    const { name, message, userId, dateTime, reminders = [] } = data;

    if (!name || !message || !userId) {
      throw new IncorrectObjectError();
    }

    try {
      const pingId = this.pingsRepository.nextIdentity();
      const ping: Ping = {
        id: pingId,
        name,
        message,
        userId,
        dateTime,
        reminders: reminders.map((reminder) => ({
          pingId,
          dateTime: reminder.dateTime,
          type: reminder.type,
          userId,
          isSent: false,
          id: this.pingRemindersRepository.nextIdentity(),
        })),
      };

      this.metrics.addMetric("PingQueuedForStorage", MetricUnits.Count, 1);

      await this.mqClient.sendMessage(new StorePingCommand(ping));

      return ping;
    } catch (error) {
      logger.error(`Failed to queue ping for creation`, {
        data,
        userId,
      });

      throw error;
    }
  }
}
