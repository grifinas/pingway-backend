import { PingReminder } from "@core/pings/models";

export interface IRemindersProcessingService {
  detectUnsentReminders(): Promise<void>;
  processUnsentReminders(reminders: PingReminder[]): Promise<void>;
  processUnsentReminder(reminders: PingReminder): Promise<void>;
}
