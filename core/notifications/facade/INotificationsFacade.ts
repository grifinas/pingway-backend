import { PingReminder } from "@core/pings/models";

export interface INotificationsFacade {
  sendReminders: (reminders: PingReminder[]) => Promise<void>;
  sendReminder: (reminder: PingReminder) => Promise<void>;
}
