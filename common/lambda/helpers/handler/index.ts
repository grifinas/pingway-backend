import middy from "@middy/core";
import httpCors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import sqsBatch from "@middy/sqs-partial-batch-failure";
import eventNormalizerMiddleware from "@middy/event-normalizer";
import inputOutputLogger from "@middy/input-output-logger";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  PostConfirmationTriggerHandler,
  SNSEvent,
  SQSEvent,
  Handler,
  ScheduledEvent,
} from "aws-lambda";
import { injectLambdaContext } from "@aws-lambda-powertools/logger";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer";
import { logMetrics } from "@aws-lambda-powertools/metrics";
import { logger } from "@common/lambda/tools/logger";
import { tracer } from "@common/lambda/tools/tracer";
import { metrics } from "@common/lambda/tools/metrics";
import { domainErrorMapper } from "@common/middlewares/domain-error-mapper";
import { SQSRecord } from "@common/lambda/helpers/handler/types";

const ioLoggerMiddleware = inputOutputLogger({
  logger: (message) => logger.info(message),
});

export type PingwayAPIGatewayProxyEvent = APIGatewayProxyEvent & {
  body: undefined | Record<string, string>;
};

export function makeApiGatewayLambdaHandler(
  handler: (
    event: PingwayAPIGatewayProxyEvent
  ) => Promise<APIGatewayProxyResult>
): Handler {
  return middy(handler)
    .use(httpCors())
    .use(jsonBodyParser())
    .use(injectLambdaContext(logger))
    .use(captureLambdaHandler(tracer))
    .use(logMetrics(metrics))
    .use(domainErrorMapper())
    .use(ioLoggerMiddleware);
}

export function makeSnsLambdaHandler(
  handler: (event: SNSEvent) => Promise<APIGatewayProxyResult>
): Handler {
  return middy(handler).use(ioLoggerMiddleware);
}

export function makeSqsLambdaHandler(
  handler: (event: SQSEvent) => Promise<PromiseSettledResult<SQSRecord>[]>
): Handler {
  return middy(handler)
    .use(ioLoggerMiddleware)
    .use(eventNormalizerMiddleware())
    .use(sqsBatch());
}

export function makeCronLambdaHandler(
  handler: (event: ScheduledEvent) => Promise<void>
): Handler {
  return middy(handler).use(ioLoggerMiddleware);
}

export function makeCognitoLambdaHandler(
  handler: PostConfirmationTriggerHandler
): PostConfirmationTriggerHandler {
  const enhancedHandler = middy(handler).use(ioLoggerMiddleware);

  return async (event, context, callback) => {
    await enhancedHandler(event, context, callback);
    return event;
  };
}
