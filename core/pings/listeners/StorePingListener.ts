import { logger } from "@common/lambda/tools/logger";
import { StorePingCommand } from "@core/pings/events/StorePingCommand";
import { Ping } from "@core/pings/models";
import { IPingsRepository } from "@core/pings/repositories";

export class StorePingListener {
  constructor(private pingsRepository: IPingsRepository) {}

  handle = async ({ ping }: StorePingCommand) => {
    try {
      logger.info(`Storing ping id ${ping.id}.`);

      await this.storePing(ping);

      logger.info(`Stored ping id ${ping.id}.`);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          `Failed to process store ping event: ${error.message}`,
          error
        );
      }

      throw error;
    }
  };

  private async storePing(ping: Ping) {
    await this.pingsRepository.addPing(ping);
  }
}
