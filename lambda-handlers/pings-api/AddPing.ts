import { extractAuthorizerUser } from "@common/lambda/helpers/authorizer";
import { makeApiGatewayLambdaHandler } from "@common/lambda/helpers/handler";
import { makeResourceCreatedAsyncResponse } from "@common/lambda/helpers/response";
import { pingsFacade } from "@core/pings";
import { NewPing, NewPingReminder } from "@core/pings/models";

export const handler = makeApiGatewayLambdaHandler(async (event) => {
  const { name, message, dateTime, reminders } = event.body;
  const { userId } = extractAuthorizerUser(event);

  const newPing: NewPing = {
    name,
    message,
    userId,
    dateTime,
    reminders: reminders as unknown as NewPingReminder[],
  };
  const ping = await pingsFacade.addPing(newPing);
  return makeResourceCreatedAsyncResponse(ping.id);
});
