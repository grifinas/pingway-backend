import { PingReminder } from "@core/pings/models";

export class ReminderReachedDueDate {
  constructor(public reminder: PingReminder) {}
}
