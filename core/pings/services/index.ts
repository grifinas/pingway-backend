import { metrics } from "@common/lambda/tools/metrics";
import { messageQueueServiceClient } from "@common/sqs";
import {
  pingRemindersRepository,
  pingsRepository,
} from "@core/pings/repositories";
import { PingsService } from "@core/pings/services/impl/PingsService";
import { RemindersProcessingService } from "@core/pings/services/impl/RemindersProcessingService";

export const pingsService = new PingsService(
  metrics,
  messageQueueServiceClient,
  pingsRepository,
  pingRemindersRepository
);

export const remindersProcessingService = new RemindersProcessingService(
  metrics,
  messageQueueServiceClient,
  pingRemindersRepository
);
