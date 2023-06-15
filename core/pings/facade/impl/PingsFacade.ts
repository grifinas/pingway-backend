import { IPingsFacade } from "@core/pings/facade/IPingsFacade";
import { NewPing, Ping } from "@core/pings/models";
import { IPingsService } from "@core/pings/services/IPingsService";

export class PingsFacade implements IPingsFacade {
  constructor(private pingsService: IPingsService) {}

  addPing(data: NewPing): Promise<Ping> {
    return this.pingsService.addPing(data);
  }

  getUserUnsentPings(userId: string): Promise<Ping[]> {
    return this.pingsService.getUserUnsentPings(userId);
  }

  getUserPingById(pingId: string, userId: string): Promise<Ping | null> {
    return this.pingsService.getUserPingById(pingId, userId);
  }
}
