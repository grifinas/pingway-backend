import { PingReminder } from "@core/pings/models";

export class ReminderMarkedSent {
  constructor(public reminder: PingReminder) {}
}
