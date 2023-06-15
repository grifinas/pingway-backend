import { SES } from "@aws-sdk/client-ses";
import { Environment } from "@common/env/Environment";
import { EmailServiceClient } from "@common/ses/impl/EmailServiceClient";
import { configService } from "@common/config";

const sesClient = new SES({ region: Environment.REGION });

export const emailServiceClient = new EmailServiceClient(
  sesClient,
  configService
);
