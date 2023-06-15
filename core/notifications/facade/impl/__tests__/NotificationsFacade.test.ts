import { INotificationsFacade } from "@core/notifications/facade/INotificationsFacade";
import { NotificationsFacade } from "@core/notifications/facade/impl/NotificationsFacade";
import { Ping, PingReminder, PingReminderType } from "@core/pings/models";
import { IPingsRepository } from "@core/pings/repositories";
import { User } from "@core/users/models";
import { IUsersRepository } from "@core/users/repositories";
import { IReminderNotificationsService } from "@core/notifications/services/IReminderNotificationsService";
import { GenericError } from "@common/errors";
import { IPingsFacade } from "@core/pings/facade/IPingsFacade";
import { IUsersFacade } from "@core/users/facade/IUsersFacade";

const mockPingsFacade: IPingsFacade = {
  addPing: jest.fn(),
  getUserPingById: jest.fn(),
  getUserUnsentPings: jest.fn(),
};

const mockUsersFacade: IUsersFacade = {
  getUserById: jest.fn(),
};

const mockReminderNotificationsService: IReminderNotificationsService = {
  sendReminder: jest.fn(),
};

describe("Notifications facade", () => {
  let facade: INotificationsFacade;

  const ping: Ping = {} as Ping;
  const user: User = {} as User;

  const reminder: PingReminder = {
    id: "id",
    type: PingReminderType.Email,
    pingId: "pingId",
    dateTime: new Date().toISOString(),
    userId: "userId",
    isSent: false,
  };

  beforeEach(() => {
    facade = new NotificationsFacade(
      mockUsersFacade,
      mockPingsFacade,
      mockReminderNotificationsService
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("#sendReminders", () => {
    it("should call sendReminder for each reminder in args", async () => {
      const spy = jest.spyOn(facade, "sendReminder");

      await facade.sendReminders([reminder, reminder, reminder]);

      expect(spy).toBeCalledTimes(3);
    });

    /**
     * This is actually not the correct behaviour as this means it will stop processing once the first reminder fails
     */
    describe("when send reminder rejects", () => {
      it("should throw a generic error", async () => {
        jest.spyOn(facade, "sendReminder").mockRejectedValue(new Error());

        await expect(
          facade.sendReminders([reminder, reminder, reminder])
        ).rejects.toThrowError(new GenericError());
      });
    });
  });

  describe("#sendReminder", () => {
    describe("when user and ping are present", () => {
      beforeEach(() => {
        mockUsersFacade.getUserById = jest.fn().mockResolvedValue(user);
        mockPingsFacade.getUserPingById = jest.fn().mockResolvedValue(ping);
      });

      it("should send an email when reminder type is email", async () => {
        await facade.sendReminder(reminder);

        expect(mockReminderNotificationsService.sendReminder).toBeCalled();
      });

      it("should send an sms when reminder type is sms", async () => {
        await facade.sendReminder({
          ...reminder,
          type: PingReminderType.Sms,
        });

        expect(mockReminderNotificationsService.sendReminder).toBeCalled();
      });
    });

    describe("when user is not present", () => {
      beforeEach(() => {
        mockUsersFacade.getUserById = jest.fn().mockResolvedValue(null);
      });

      it("should not send an email", async () => {
        const spy = jest.spyOn(
          mockReminderNotificationsService,
          "sendReminder"
        );

        await facade.sendReminder({
          ...reminder,
          type: PingReminderType.Email,
        });

        expect(spy).not.toBeCalled();
      });

      it("should not send an sms", async () => {
        const spy = jest.spyOn(
          mockReminderNotificationsService,
          "sendReminder"
        );

        await facade.sendReminder({
          ...reminder,
          type: PingReminderType.Sms,
        });

        expect(spy).not.toBeCalled();
      });
    });

    describe("when ping is not present", () => {
      beforeEach(() => {
        mockUsersFacade.getUserById = jest.fn().mockResolvedValue(user);
        mockPingsFacade.getUserPingById = jest.fn().mockResolvedValue(null);
      });

      it("should not send an email", async () => {
        const spy = jest.spyOn(
          mockReminderNotificationsService,
          "sendReminder"
        );

        await facade.sendReminder({
          ...reminder,
          type: PingReminderType.Email,
        });

        expect(spy).not.toBeCalled();
      });

      it("should not send an sms", async () => {
        const spy = jest.spyOn(
          mockReminderNotificationsService,
          "sendReminder"
        );

        await facade.sendReminder({
          ...reminder,
          type: PingReminderType.Sms,
        });

        expect(spy).not.toBeCalled();
      });
    });
  });
});
