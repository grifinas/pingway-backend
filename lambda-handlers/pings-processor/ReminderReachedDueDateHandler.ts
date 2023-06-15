import {
  IParser,
  QueueMessageHandler,
} from "@common/lambda/helpers/structured-handler";
import { ReminderReachedDueDate } from "@core/pings/events/ReminderReachedDueDate";
import { reminderReachedDueDateListener } from "@core/pings";

const parser: IParser<ReminderReachedDueDate> = {
  parseRecord(record) {
    return new ReminderReachedDueDate(record.body.reminder);
  },
};

export const handler = new QueueMessageHandler(
  reminderReachedDueDateListener,
  parser
).getHandler();
