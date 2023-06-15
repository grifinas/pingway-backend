import { Metrics, MetricUnits } from "@aws-lambda-powertools/metrics";
import { GenericError } from "@common/errors";
import { logger } from "@common/lambda/tools/logger";
import { IMessageQueueServiceClient } from "@common/sqs";
import { ReminderMarkedSent } from "@core/pings/events/ReminderMarkedSent";
import { ReminderReachedDueDate } from "@core/pings/events/ReminderReachedDueDate";
import { PingReminder } from "@core/pings/models";
import { IPingRemindersRepository } from "@core/pings/repositories/IPingRemindersRepository";
import { IRemindersProcessingService } from "@core/pings/services/IRemindersProcessingService";

export class RemindersProcessingService implements IRemindersProcessingService {
  constructor(
    private metrics: Metrics,
    private mqClient: IMessageQueueServiceClient,
    private pingRemindersRepository: IPingRemindersRepository
  ) {}

  async detectUnsentReminders() {
    try {
      const reminders = await this.pingRemindersRepository.getUnsentReminders();

      logger.info(
        `Processing ${reminders.length} reminders to be queued for reminders service.`
      );

      this.metrics.addMetric(
        "UnsentReminderFound",
        MetricUnits.Count,
        reminders.length
      );

      await Promise.all(
        reminders.map((reminder) =>
          this.mqClient.sendMessage(new ReminderReachedDueDate(reminder))
        )
      );

      logger.info(`Finished processing ${reminders.length} reminders.`);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error processing unsent reminders: ${error.message}`);
      } else {
        logger.error(
          `Error processing unsent reminders: ${JSON.stringify(error)}`
        );
      }

      throw new GenericError();
    }
  }

  async processUnsentReminders(reminders: PingReminder[]) {
    await Promise.all(
      reminders.map((reminder) => this.processUnsentReminder(reminder))
    );
  }

  async processUnsentReminder(reminder: PingReminder) {
    await this.pingRemindersRepository.markReminderAsSent(
      reminder.pingId,
      reminder.id
    );
    await this.mqClient.sendMessage(new ReminderMarkedSent(reminder));
    this.metrics.addMetric("UnsentReminderProcessed", MetricUnits.Count, 1);
  }
}
