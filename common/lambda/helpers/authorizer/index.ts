import { APIGatewayProxyEvent } from "aws-lambda";

type AuthorizerUser = {
  userId: string;
};

export function extractAuthorizerUser(
  event: APIGatewayProxyEvent
): AuthorizerUser {
  const { ["cognito:username"]: userId } =
    event.requestContext.authorizer!.claims;

  return {
    userId,
  };
}
