import { Metrics } from "@aws-lambda-powertools/metrics";
import { IEmailServiceClient } from "@common/ses/IEmailServiceClient";
import { ISmsServiceClient } from "@common/sms/ISmsServiceClient";
import { ReminderNotificationsService } from "@core/notifications/services/impl/ReminderNotificationsService";
import { Ping, PingReminder, PingReminderType } from "@core/pings/models";
import { User } from "@core/users/models";

const mockEmailServiceClient: IEmailServiceClient = {
  sendEmail: jest.fn(),
};

const mockSmsServiceClient: ISmsServiceClient = {
  sendSms: jest.fn(),
};

const mockMetrics = new Metrics();

describe("Reminder notifications service", () => {
  let service: ReminderNotificationsService;

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
    service = new ReminderNotificationsService(
      mockMetrics,
      mockEmailServiceClient,
      mockSmsServiceClient
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("#sendReminder", () => {
    describe("when user and ping are present", () => {
      it("should send an email when reminder type is email", async () => {
        await service.sendReminder(user, ping, reminder);

        expect(mockEmailServiceClient.sendEmail).toBeCalled();
      });

      it("should send an sms when reminder type is sms", async () => {
        const smsReminder = {
          ...reminder,
          type: PingReminderType.Sms,
        };

        await service.sendReminder(user, ping, smsReminder);

        expect(mockSmsServiceClient.sendSms).toBeCalled();
      });

      it("should swallow error when sms service throws it", async () => {
        mockSmsServiceClient.sendSms = jest.fn().mockRejectedValue(new Error());

        const smsReminder = {
          ...reminder,
          type: PingReminderType.Sms,
        };

        await expect(
          service.sendReminder(user, ping, smsReminder)
        ).resolves.not.toThrow();
      });

      it("should swallow error when email service throws it", async () => {
        mockEmailServiceClient.sendEmail = jest
          .fn()
          .mockRejectedValue(new Error());

        const emailReminder = {
          ...reminder,
          type: PingReminderType.Email,
        };

        await expect(
          service.sendReminder(user, ping, emailReminder)
        ).resolves.not.toThrow();
      });
    });
  });
});
