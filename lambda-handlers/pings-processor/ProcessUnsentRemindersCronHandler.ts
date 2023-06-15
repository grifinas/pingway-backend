import { CronHandler } from "@common/lambda/helpers/structured-handler";
import { processUnsentRemindersCronListener } from "@core/pings";

export const handler = new CronHandler(
  processUnsentRemindersCronListener
).getHandler();
