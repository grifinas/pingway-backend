import { PingsRepository } from "@core/pings/repositories/impl/PingsRepository";
import { documentClient } from "@common/dynamodb/documentClient";
import { configService } from "@common/config";
import { PingRemindersRepository } from "@core/pings/repositories/impl/PingRemindersRepository";
export { IPingsRepository } from "@core/pings/repositories/IPingsRepository";

export const pingsRepository = new PingsRepository(
  documentClient,
  configService
);

export const pingRemindersRepository = new PingRemindersRepository(
  documentClient,
  configService
);
