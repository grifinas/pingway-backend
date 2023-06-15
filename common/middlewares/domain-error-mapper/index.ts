import { Logger } from "@aws-lambda-powertools/logger";
import { IncorrectObjectError, ObjectNotFoundError } from "@common/errors";
import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { logger } from "@common/lambda/tools/logger";

type DomainErrorMapperMiddlewareOptions = {
  logger: Logger;
};

const defaults: DomainErrorMapperMiddlewareOptions = {
  logger,
};

export function domainErrorMapper(
  opts: Partial<DomainErrorMapperMiddlewareOptions> = {}
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> {
  const options = {
    ...defaults,
    ...opts,
  };

  return {
    onError: async (event) => {
      options.logger.error(`[API] Error`, event.error!);

      if (event.error instanceof IncorrectObjectError) {
        event.response = {
          ...event.response,
          statusCode: 400,
          body: "Bad request",
          headers: {
            ...event.response?.headers,
            "Content-Type": "text/plain",
          },
        };
      } else if (event.error instanceof ObjectNotFoundError) {
        event.response = {
          ...event.response,
          statusCode: 404,
          body: "Not found",
          headers: {
            ...event.response?.headers,
            "Content-Type": "text/plain",
          },
        };
      } else {
        event.response = {
          ...event.response,
          statusCode: 500,
          body: "Something went wrong",
          headers: {
            ...event.response?.headers,
            "Content-Type": "text/plain",
          },
        };
      }
    },
  };
}
