import { SES } from "@aws-sdk/client-ses";
import { logger } from "@common/lambda/tools/logger";
import {
  ISendSmsParams,
  ISmsServiceClient,
} from "@common/sms/ISmsServiceClient";
import { IConfigService } from "@common/config/IConfigService";

export class SmsServiceClient implements ISmsServiceClient {
  constructor(private ses: SES, private configService: IConfigService) {}

  async sendSms(params: ISendSmsParams) {
    logger.info(`Sending sms to ${params.tel}.`);

    await this.ses.sendEmail({
      Destination: {
        ToAddresses: [params.tel],
      },
      Message: {
        Body: {
          Text: {
            Data: params.text,
          },
        },
        Subject: {
          Data: `[SMS] ${
            params.text.length > 10
              ? params.text.slice(0, 10).concat("...")
              : params.text
          }`,
        },
      },
      Source: this.configService.get("SES_SOURCE"),
    });

    logger.info(`Sent sms to ${params.tel}.`);
  }
}
