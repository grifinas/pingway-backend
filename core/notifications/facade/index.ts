import { NotificationsFacade } from "@core/notifications/facade/impl/NotificationsFacade";
import { reminderNotificationsService } from "@core/notifications/services";
import { pingsFacade } from "@core/pings";
import { usersFacade } from "@core/users";

export const notificationsFacade = new NotificationsFacade(
  usersFacade,
  pingsFacade,
  reminderNotificationsService
);
