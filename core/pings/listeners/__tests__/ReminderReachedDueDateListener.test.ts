import { ReminderReachedDueDate } from "@core/pings/events/ReminderReachedDueDate";
import { PingReminder } from "@core/pings/models";
import { remindersProcessingService } from "@core/pings/services";
import { ReminderReachedDueDateListener } from "@core/pings/listeners/ReminderReachedDueDateListener";

describe("Reminders reached due date listener", () => {
  let reminderReachedDueDateListener: ReminderReachedDueDateListener;

  beforeEach(() => {
    reminderReachedDueDateListener = new ReminderReachedDueDateListener(
      remindersProcessingService
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("#handle()", () => {
    it("should send reminders for processing to reminders processing service", async () => {
      const spy = jest
        .spyOn(remindersProcessingService, "processUnsentReminder")
        .mockImplementation();

      await reminderReachedDueDateListener.handle(
        new ReminderReachedDueDate({} as PingReminder)
      );

      expect(spy).toBeCalled();
    });
  });
});
