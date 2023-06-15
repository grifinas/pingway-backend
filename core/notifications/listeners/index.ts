import { notificationsFacade } from "@core/notifications/facade";
import { ReminderMarkedSentListener } from "@core/notifications/listeners/ReminderMarkedSentListener";

export const reminderMarkedSentListener = new ReminderMarkedSentListener(
  notificationsFacade
);
