import {
  IParser,
  QueueMessageHandler,
} from "@common/lambda/helpers/structured-handler";
import { StorePingCommand } from "@core/pings/events/StorePingCommand";
import { storePingsListener } from "@core/pings";

const parser: IParser<StorePingCommand> = {
  parseRecord(record) {
    return new StorePingCommand(record.body.ping);
  },
};

export const handler = new QueueMessageHandler(
  storePingsListener,
  parser
).getHandler();
