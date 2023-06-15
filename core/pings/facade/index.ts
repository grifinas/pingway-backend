import { PingsFacade } from "@core/pings/facade/impl/PingsFacade";
import { pingsService } from "@core/pings/services";

export const pingsFacade = new PingsFacade(pingsService);
