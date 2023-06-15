import { IMessageQueueServiceClient } from "@common/sqs";
import {
  NewPing,
  NewPingReminder,
  Ping,
  PingReminder,
  PingReminderType,
} from "@core/pings/models";
import { IPingsRepository } from "@core/pings/repositories";
import { IPingRemindersRepository } from "@core/pings/repositories/IPingRemindersRepository";
import { PingRemindersService } from "@core/pings/services/impl/PingRemindersService";

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

describe("Pings reminders service", () => {
  let pingRemindersService: PingRemindersService;

  const userId = "testUserId";
  const newPing: NewPing = {
    name: "Write tests",
    message: "TDD Rocks",
    dateTime: "testDateTime",
    userId: userId,
    reminders: [],
  };
  const ping: Ping = {
    ...newPing,
    id: "testPingId",
    reminders: [],
  };
  const newPingReminder: NewPingReminder = {
    pingId: ping.id,
    userId,
    type: PingReminderType.Email,
    dateTime: new Date().toISOString(),
  };
  const pingReminder: PingReminder = {
    ...newPingReminder,
    pingId: ping.id,
    userId,
    id: "testPingReminderId",
    isSent: false,
  };

  beforeEach(() => {
    pingRemindersService = new PingRemindersService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe.skip("#addPingReminder()", () => {
    it("should query for ping by reminder ping id with pings repository", async () => {
      const querySpy = jest.spyOn(mockPingsRepository, "getPingById");

      await pingRemindersService.addPingReminder(newPingReminder);

      expect(querySpy).toBeCalledWith(pingReminder.pingId);
    });

    it("should store the reminder", async () => {
      jest.spyOn(mockPingsRepository, "getPingById").mockResolvedValue(ping);
      jest
        .spyOn(mockPingRemindersRepository, "nextIdentity")
        .mockReturnValue(pingReminder.id);

      const querySpy = jest.spyOn(mockPingRemindersRepository, "addReminders");

      await pingRemindersService.addPingReminder(newPingReminder);

      expect(querySpy).toBeCalledWith(pingReminder);
    });

    it("should return the stored reminder", async () => {
      jest
        .spyOn(mockPingRemindersRepository, "nextIdentity")
        .mockReturnValue(pingReminder.id);
      jest.spyOn(mockPingsRepository, "getPingById").mockResolvedValue(ping);
      jest
        .spyOn(mockPingRemindersRepository, "addReminders")
        .mockResolvedValue(undefined);

      const result = await pingRemindersService.addPingReminder(
        newPingReminder
      );

      expect(result).toEqual(pingReminder);
    });

    describe("when ping doesn't exist", () => {
      it("should return null", async () => {
        jest.spyOn(mockPingsRepository, "getPingById").mockResolvedValue(null);

        const result = await pingRemindersService.addPingReminder(pingReminder);

        expect(result).toBe(null);
      });
    });

    describe("when pings repository throws an error", () => {
      it("should gracefully return null", async () => {
        jest
          .spyOn(mockPingsRepository, "getPingById")
          .mockImplementation(() => {
            throw new Error();
          });

        const result = await pingRemindersService.addPingReminder(pingReminder);

        expect(result).toBe(null);
      });
    });
  });
});
