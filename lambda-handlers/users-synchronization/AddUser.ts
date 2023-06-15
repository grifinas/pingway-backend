import { makeCognitoLambdaHandler } from "@common/lambda/helpers/handler";
import { usersFacade } from "@core/users";
import { User } from "@core/users/models";
import { PostConfirmationTriggerEvent } from "aws-lambda";

export function parseEvent(event: PostConfirmationTriggerEvent): User {
  const user: User = {
    userId: event.request.userAttributes.sub,
    email: event.request.userAttributes.email,
    isVerified: true,
  };

  return user;
}

export const handler = makeCognitoLambdaHandler(
  (event: PostConfirmationTriggerEvent): Promise<void> =>
    usersFacade.addUser(parseEvent(event))
);
