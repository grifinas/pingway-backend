import { PingReminder } from "@core/pings/models";

export interface IPingRemindersRepository {
  markReminderAsSent(reminderId: string, pingId: string): Promise<void>;
  getUnsentReminders(): Promise<PingReminder[]>;
  addReminders(reminders: PingReminder[]): Promise<void>;
  nextIdentity(): string;
}
