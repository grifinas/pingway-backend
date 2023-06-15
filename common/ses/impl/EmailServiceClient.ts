import { SES } from "@aws-sdk/client-ses";
import { logger } from "@common/lambda/tools/logger";
import {
  IEmailServiceClient,
  ISendEmailParams,
} from "@common/ses/IEmailServiceClient";
import { IConfigService } from "@common/config/IConfigService";

export class EmailServiceClient implements IEmailServiceClient {
  constructor(private ses: SES, private configService: IConfigService) {}

  async sendEmail(params: ISendEmailParams) {
    logger.info(`Sending email to ${params.to}.`);

    await this.ses.sendEmail({
      Destination: {
        ToAddresses: [params.to],
      },
      Message: {
        Body: {
          Text: {
            Data: params.text,
          },
          ...(params.html && {
            Html: {
              Data: params.html,
            },
          }),
        },
        Subject: {
          Data: params.subject,
        },
      },
      Source: this.configService.get("SES_SOURCE"),
    });

    logger.info(`Sent email to ${params.to}.`);
  }
}
