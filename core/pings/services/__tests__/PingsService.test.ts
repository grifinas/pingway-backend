import { Metrics } from "@aws-lambda-powertools/metrics";
import { IMessageQueueServiceClient } from "@common/sqs";
import { StorePingCommand } from "@core/pings/events/StorePingCommand";
import {
  NewPing,
  NewPingReminder,
  Ping,
  PingReminder,
  PingReminderType,
} from "@core/pings/models";
import { IPingsRepository } from "@core/pings/repositories";
import { IPingRemindersRepository } from "@core/pings/repositories/IPingRemindersRepository";
import { PingsService } from "@core/pings/services/impl/PingsService";

const mockPingsRepository: IPingsRepository = {
  addPing: jest.fn(),
  getPingById: jest.fn(),
  getCurrentPings: jest.fn(),
  nextIdentity: jest.fn(),
};

const mockPingRemindersRepository: IPingRemindersRepository = {
  markReminderAsSent: jest.fn(),
  getUnsentReminders: jest.fn(),
  addReminders: jest.fn(),
  nextIdentity: jest.fn(),
};

const mockMqClient: IMessageQueueServiceClient = {
  sendMessage: jest.fn(),
};

describe("Pings service", () => {
  let pingsService: PingsService;

  const userId = "testUserId";
  const pingId = "testPindId";
  const pingReminderId = "testPingReminderId";

  const newPing: NewPing = {
    name: "Write tests",
    message: "TDD Rocks",
    dateTime: "testDateTime",
    userId: userId,
    reminders: [],
  };
  const ping: Ping = {
    ...newPing,
    id: pingId,
    reminders: [],
  };
  const newPingReminder: NewPingReminder = {
    pingId,
    userId,
    type: PingReminderType.Email,
    dateTime: new Date().toISOString(),
  };
  const pingReminder: PingReminder = {
    ...newPingReminder,
    pingId: ping.id,
    userId,
    id: pingReminderId,
    isSent: false,
  };

  const mockMetrics: Metrics = new Metrics();

  beforeEach(() => {
    pingsService = new PingsService(
      mockMetrics,
      mockMqClient,
      mockPingsRepository,
      mockPingRemindersRepository
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("#getUserUnsentPings()", () => {
    it("should query for user pings with pings repository", async () => {
      const querySpy = jest.spyOn(mockPingsRepository, "getCurrentPings");

      await pingsService.getUserUnsentPings(userId);

      expect(querySpy).toBeCalledWith({ userId });
    });

    it("should return pings repository query results", async () => {
      const repoPings: Ping[] = [];

      jest
        .spyOn(mockPingsRepository, "getCurrentPings")
        .mockResolvedValue(repoPings);

      const pings = await pingsService.getUserUnsentPings(userId);

      expect(pings).toBe(repoPings);
    });

    describe("when pings repository throws an error", () => {
      it("should gracefully return an empty array", async () => {
        jest
          .spyOn(mockPingsRepository, "getCurrentPings")
          .mockImplementation(() => {
            throw new Error();
          });

        await expect(pingsService.getUserUnsentPings(userId)).resolves.toEqual(
          []
        );
      });
    });
  });

  describe("#addPing", () => {
    it("should throw an error when data object is incomplete", async () => {
      await expect(
        pingsService.addPing({
          name: "",
          message: "",
          userId: "",
          dateTime: "",
          reminders: [],
        })
      ).rejects.toThrow();
    });

    it("should send a new command to store the ping", async () => {
      const sendMessageSpy = jest.spyOn(mockMqClient, "sendMessage");

      await pingsService.addPing(newPing);

      expect(sendMessageSpy).toBeCalled();
    });

    it("should enrich ping reminders with other attributes", async () => {
      const { id: nextIdentityId } = ping;
      const { id: nextReminderIdentityId } = pingReminder;
      jest
        .spyOn(mockPingsRepository, "nextIdentity")
        .mockReturnValue(nextIdentityId);
      jest
        .spyOn(mockPingRemindersRepository, "nextIdentity")
        .mockReturnValue(nextReminderIdentityId);

      const sendMessageSpy = jest.spyOn(mockMqClient, "sendMessage");

      const reminders: NewPingReminder[] = [
        { pingId, userId, dateTime: "test", type: PingReminderType.Email },
        { pingId, userId, dateTime: "test2", type: PingReminderType.Email },
      ];
      await pingsService.addPing({
        ...newPing,
        reminders,
      });

      const [commandArg] = sendMessageSpy.mock.lastCall;

      (commandArg as StorePingCommand).ping.reminders.forEach((reminder) => {
        expect(reminder).toHaveProperty("dateTime");
        expect(reminder).toHaveProperty("pingId", nextIdentityId);
        expect(reminder).toHaveProperty("id", nextReminderIdentityId);
        expect(reminder).toHaveProperty("isSent", false);
      });
    });

    it("should enrich the new ping with id before sending the command", async () => {
      const { id: nextIdentityId } = ping;
      jest
        .spyOn(mockPingsRepository, "nextIdentity")
        .mockReturnValue(nextIdentityId);

      const sendMessageSpy = jest.spyOn(mockMqClient, "sendMessage");

      await pingsService.addPing(newPing);

      const [commandArg] = sendMessageSpy.mock.lastCall;

      expect((commandArg as StorePingCommand).ping.id).toBe(nextIdentityId);
    });

    it("should return the ping", async () => {
      const { id: nextIdentityId } = ping;
      jest
        .spyOn(mockPingsRepository, "nextIdentity")
        .mockReturnValue(nextIdentityId);

      const result = await pingsService.addPing(newPing);

      expect(result).toEqual(ping);
    });

    it("should return the ping reminders", async () => {
      const { id: nextIdentityId } = ping;
      const { id: nextReminderIdentityId } = pingReminder;
      jest
        .spyOn(mockPingsRepository, "nextIdentity")
        .mockReturnValue(nextIdentityId);
      jest
        .spyOn(mockPingRemindersRepository, "nextIdentity")
        .mockReturnValue(nextReminderIdentityId);

      const reminders: NewPingReminder[] = [
        { pingId, userId, type: PingReminderType.Email, dateTime: "test" },
      ];
      const result = await pingsService.addPing({
        ...newPing,
        reminders,
      });

      const resultReminders: PingReminder[] = [
        {
          id: nextReminderIdentityId,
          userId: "testUserId",
          dateTime: "test",
          type: PingReminderType.Email,
          pingId: nextIdentityId,
          isSent: false,
        },
      ];
      expect(result.reminders).toEqual(resultReminders);
    });
  });
});
