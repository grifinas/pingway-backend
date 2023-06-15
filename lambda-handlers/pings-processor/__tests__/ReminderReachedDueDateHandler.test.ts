import { reminderReachedDueDateListener } from "@core/pings/listeners";
import { handler } from "lambda-handlers/pings-processor/ReminderReachedDueDateHandler";
import { SQSRecord } from "aws-lambda";

describe("ReminderReachedDueDateHandler", () => {
  it("should call reminderReachedDueDateListener with a list of records from event", async () => {
    const spy = jest
      .spyOn(reminderReachedDueDateListener, "handle")
      .mockImplementation();

    await handler({
      Records: [
        {
          body: JSON.stringify({ reminder: {} }),
        } as SQSRecord,
      ],
    });

    expect(spy).toBeCalled();
  });
});
