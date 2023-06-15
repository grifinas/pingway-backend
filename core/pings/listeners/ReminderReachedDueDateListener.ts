import { ReminderReachedDueDate } from "@core/pings/events/ReminderReachedDueDate";
import { IRemindersProcessingService } from "@core/pings/services/IRemindersProcessingService";

export class ReminderReachedDueDateListener {
  constructor(
    private remindersProcessingService: IRemindersProcessingService
  ) {}

  handle = async ({ reminder }: ReminderReachedDueDate) => {
    await this.remindersProcessingService.processUnsentReminder(reminder);
  };
}
