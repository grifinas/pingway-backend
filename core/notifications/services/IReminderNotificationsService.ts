import { Ping, PingReminder } from "@core/pings/models";
import { User } from "@core/users/models";

export interface IReminderNotificationsService {
  sendReminder(user: User, ping: Ping, reminder: PingReminder): Promise<void>;
}
