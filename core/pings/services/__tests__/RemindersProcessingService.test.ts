import { Metrics } from "@aws-lambda-powertools/metrics";
import { GenericError } from "@common/errors";
import { IMessageQueueServiceClient } from "@common/sqs";
import { PingReminder } from "@core/pings/models";
import { IPingRemindersRepository } from "@core/pings/repositories/IPingRemindersRepository";
import { RemindersProcessingService } from "@core/pings/services/impl/RemindersProcessingService";

const mockPingRemindersRepository: IPingRemindersRepository = {
  markReminderAsSent: jest.fn(),
  getUnsentReminders: jest.fn(),
  addReminders: jest.fn(),
  nextIdentity: jest.fn(),
};

const mockMqClient: IMessageQueueServiceClient = {
  sendMessage: jest.fn(),
};

const mockMetrics: Metrics = new Metrics();

describe("Pings reminders service", () => {
  let remindersProcessingService: RemindersProcessingService;

  beforeEach(() => {
    remindersProcessingService = new RemindersProcessingService(
      mockMetrics,
      mockMqClient,
      mockPingRemindersRepository
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("#processUnsentReminders()", () => {
    it("should mark each ping as sent", async () => {
      const markAsSentSpy = jest.spyOn(
        mockPingRemindersRepository,
        "markReminderAsSent"
      );

      await remindersProcessingService.processUnsentReminders([
        {} as PingReminder,
        {} as PingReminder,
      ]);

      expect(markAsSentSpy).toBeCalledTimes(2);
    });

    it("should send a marked as sent message for each reminder", async () => {
      const sendMessageSpy = jest.spyOn(mockMqClient, "sendMessage");

      await remindersProcessingService.processUnsentReminders([
        {} as PingReminder,
        {} as PingReminder,
      ]);

      expect(sendMessageSpy).toBeCalledTimes(2);
    });
  });

  describe("#detectUnsentReminders()", () => {
    it("should query all unprocessed pings", async () => {
      const querySpy = jest
        .spyOn(mockPingRemindersRepository, "getUnsentReminders")
        .mockResolvedValue([]);

      await remindersProcessingService.detectUnsentReminders();

      expect(querySpy).toBeCalled();
    });

    it("should send commands to send pings for each ping", async () => {
      const reminders: PingReminder[] = [{} as PingReminder];

      jest
        .spyOn(mockPingRemindersRepository, "getUnsentReminders")
        .mockResolvedValue(reminders);
      const sendMessageSpy = jest.spyOn(mockMqClient, "sendMessage");

      await remindersProcessingService.detectUnsentReminders();

      expect(sendMessageSpy).toBeCalledTimes(reminders.length);
    });

    describe("when unprocessed pings query fails", () => {
      it("should throw a generic error", async () => {
        jest
          .spyOn(mockPingRemindersRepository, "getUnsentReminders")
          .mockImplementation(() => {
            throw new Error();
          });

        await expect(
          remindersProcessingService.detectUnsentReminders()
        ).rejects.toBeInstanceOf(GenericError);
      });
    });

    describe("when messaging client send command fails", () => {
      it("should throw a generic error", async () => {
        const reminders: PingReminder[] = [{} as PingReminder];

        jest
          .spyOn(mockPingRemindersRepository, "getUnsentReminders")
          .mockResolvedValue(reminders);

        jest.spyOn(mockMqClient, "sendMessage").mockImplementation(() => {
          throw new Error();
        });

        await expect(
          remindersProcessingService.detectUnsentReminders()
        ).rejects.toBeInstanceOf(GenericError);
      });
    });
  });
});
