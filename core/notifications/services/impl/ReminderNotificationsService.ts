import { Metrics, MetricUnits } from "@aws-lambda-powertools/metrics";
import { logger } from "@common/lambda/tools/logger";
import { IEmailServiceClient } from "@common/ses/IEmailServiceClient";
import { ISmsServiceClient } from "@common/sms/ISmsServiceClient";
import { IReminderNotificationsService } from "@core/notifications/services/IReminderNotificationsService";
import { Ping, PingReminder, PingReminderType } from "@core/pings/models";
import { User } from "@core/users/models";

export class ReminderNotificationsService
  implements IReminderNotificationsService
{
  constructor(
    private metrics: Metrics,
    private emailServiceClient: IEmailServiceClient,
    private smsServiceClient: ISmsServiceClient
  ) {}

  async sendReminder(user: User, ping: Ping, reminder: PingReminder) {
    switch (reminder.type) {
      case PingReminderType.Sms: {
        await this.sendSmsReminder(user, ping);
        break;
      }
      default:
        await this.sendEmailReminder(user, ping);
        break;
    }

    this.metrics.addMetric("PingReminderSent", MetricUnits.Count, 1);
  }

  private async sendEmailReminder(user: User, ping: Ping) {
    try {
      await this.emailServiceClient.sendEmail({
        to: user.email,
        subject: ping.name,
        text: ping.message,
      });
      logger.info(
        `Email to ${user.email} about ping ${ping.name} has been sent.`
      );
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          `Email to ${user.email} about ping ${ping.name} was not sent: ${error.message}.`
        );
      }
    }
  }

  private async sendSmsReminder(user: User, ping: Ping) {
    try {
      await this.smsServiceClient.sendSms({
        tel: user.email,
        text: ping.message,
      });
      logger.info(
        `SMS to ${user.email} about ping ${ping.name} has been sent.`
      );
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          `SMS to ${user.email} about ping ${ping.name} was not sent: ${error.message}.`
        );
      }
    }
  }
}
