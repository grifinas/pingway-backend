import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({
  serviceName: "PingwayAPI",
  logLevel: "DEBUG",
});

export { logger };
