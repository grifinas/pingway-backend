import { ReminderMarkedSent } from "@core/pings/events/ReminderMarkedSent";
import { reminderMarkedSentListener } from "@core/notifications";
import {
  IParser,
  QueueMessageHandler,
} from "@common/lambda/helpers/structured-handler";

const parser: IParser<ReminderMarkedSent> = {
  parseRecord(record) {
    return new ReminderMarkedSent(record.body.reminder);
  },
};

export const handler = new QueueMessageHandler(
  reminderMarkedSentListener,
  parser
).getHandler();
