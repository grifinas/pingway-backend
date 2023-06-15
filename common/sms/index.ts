import { SmsServiceClient } from "@common/sms/impl/SmsServiceClient";
import { SES } from "@aws-sdk/client-ses";
import { Environment } from "@common/env/Environment";
import { configService } from "@common/config";

const sesClient = new SES({ region: Environment.REGION });

export const smsServiceClient = new SmsServiceClient(sesClient, configService);
