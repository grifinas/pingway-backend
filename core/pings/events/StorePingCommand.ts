import { Ping } from "@core/pings/models";

export class StorePingCommand {
  constructor(public ping: Ping) {}
}
