import { NewPingReminder } from "@core/pings/models";

export interface IPingRemindersService {
  addPingReminder(pingReminder: NewPingReminder): Promise<void>;
}
