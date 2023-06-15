import { IRemindersProcessingService } from "@core/pings/services/IRemindersProcessingService";

export class ProcessUnsentRemindersCronListener {
  constructor(
    private remindersProcessingService: IRemindersProcessingService
  ) {}

  handle = async () => {
    await this.remindersProcessingService.detectUnsentReminders();
  };
}
