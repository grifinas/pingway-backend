import { metrics } from "@common/lambda/tools/metrics";
import { emailServiceClient } from "@common/ses";
import { smsServiceClient } from "@common/sms";
import { ReminderNotificationsService } from "@core/notifications/services/impl/ReminderNotificationsService";

export const reminderNotificationsService = new ReminderNotificationsService(
  metrics,
  emailServiceClient,
  smsServiceClient
);
