import {
  makeCronLambdaHandler,
  makeSqsLambdaHandler,
} from "@common/lambda/helpers/handler";
import { SQSRecord } from "@common/lambda/helpers/handler/types";
import { ScheduledEvent } from "aws-lambda";

type SQSEvent = {
  Records: SQSRecord[];
};

export interface IConsumer<TParsedEvent extends Object> {
  handle: (event: TParsedEvent | never) => Promise<void>;
}

export interface IParser<TParsedRecord extends Object> {
  parseRecord(record: SQSRecord): TParsedRecord;
}

export class QueueMessageHandler<TParsedEvent extends Object> {
  constructor(
    private handler: IConsumer<TParsedEvent>,
    private parser?: IParser<TParsedEvent>
  ) {}

  getHandler = (): ((
    event: SQSEvent
  ) => Promise<PromiseSettledResult<SQSRecord>[]>) =>
    makeSqsLambdaHandler(this.handle) as any;

  private handle = async (
    event: SQSEvent
  ): Promise<PromiseSettledResult<SQSRecord>[]> => {
    const recordPromises = event.Records.map(async (record) => {
      if (this.parser) {
        await this.handler.handle(this.parser.parseRecord(record));
      } else {
        await this.handler.handle(undefined as never);
      }
      return record;
    });

    return Promise.allSettled(recordPromises);
  };
}

export class CronHandler {
  constructor(private handler: IConsumer<never>) {}

  getHandler = (): ((event: ScheduledEvent) => Promise<void>) =>
    makeCronLambdaHandler(this.handle) as any;

  private handle = async (): Promise<void> => {
    await this.handler.handle(undefined as never);
  };
}
