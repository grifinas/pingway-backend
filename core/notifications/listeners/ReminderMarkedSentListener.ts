import { INotificationsFacade } from "@core/notifications/facade/INotificationsFacade";
import { ReminderMarkedSent } from "@core/pings/events/ReminderMarkedSent";

export class ReminderMarkedSentListener {
  constructor(private notificationsFacade: INotificationsFacade) {}

  handle = async ({ reminder }: ReminderMarkedSent) => {
    await this.notificationsFacade.sendReminder(reminder);
  };
}
