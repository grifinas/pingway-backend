import { pingsRepository } from "@core/pings/repositories";
import { ReminderReachedDueDateListener } from "@core/pings/listeners/ReminderReachedDueDateListener";
import { StorePingListener } from "@core/pings/listeners/StorePingListener";
import { remindersProcessingService } from "@core/pings/services";
import { ProcessUnsentRemindersCronListener } from "@core/pings/listeners/ProcessUnsentRemindersCronListener";

export const reminderReachedDueDateListener =
  new ReminderReachedDueDateListener(remindersProcessingService);

export const processUnsentRemindersCronListener =
  new ProcessUnsentRemindersCronListener(remindersProcessingService);

export const storePingsListener = new StorePingListener(pingsRepository);
