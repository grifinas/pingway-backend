import { extractAuthorizerUser } from "@common/lambda/helpers/authorizer";
import { makeApiGatewayLambdaHandler } from "@common/lambda/helpers/handler";
import { makeGetResourceResponse } from "@common/lambda/helpers/response";
import { pingsFacade } from "@core/pings";

export const handler = makeApiGatewayLambdaHandler(async (event) => {
  const { userId } = extractAuthorizerUser(event);

  const pings = await pingsFacade.getUserUnsentPings(userId);

  return makeGetResourceResponse(pings);
});
