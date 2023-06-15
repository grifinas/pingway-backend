import { INotificationsFacade } from "@core/notifications/facade/INotificationsFacade";
import { IReminderNotificationsService } from "@core/notifications/services/IReminderNotificationsService";
import { PingReminder } from "@core/pings/models";
import { logger } from "@common/lambda/tools/logger";
import { GenericError } from "@common/errors";
import { IPingsFacade } from "@core/pings/facade/IPingsFacade";
import { IUsersFacade } from "@core/users/facade/IUsersFacade";

export class NotificationsFacade implements INotificationsFacade {
  constructor(
    private usersFacade: IUsersFacade,
    private pingsFacade: IPingsFacade,
    private reminderNotificationsService: IReminderNotificationsService
  ) {}

  async sendReminders(reminders: PingReminder[]) {
    try {
      logger.info(`Processing ${reminders.length} reminders to be sent.`);

      await Promise.all(
        reminders.map((reminder) => this.sendReminder(reminder))
      );

      logger.info(`Sent ${reminders.length} reminders.`);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to send reminders: ${error.message}`);
      }

      throw new GenericError();
    }
  }

  async sendReminder(reminder: PingReminder) {
    const user = await this.usersFacade.getUserById(reminder.userId);
    if (!user) {
      return;
    }

    const ping = await this.pingsFacade.getUserPingById(
      reminder.pingId,
      reminder.userId
    );
    if (!ping) {
      return;
    }

    await this.reminderNotificationsService.sendReminder(user, ping, reminder);
  }
}
