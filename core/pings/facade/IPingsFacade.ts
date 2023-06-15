import { NewPing, Ping } from "@core/pings/models";

export interface IPingsFacade {
  addPing(data: NewPing): Promise<Ping>;
  getUserUnsentPings(userId: string): Promise<Ping[]>;
  getUserPingById(pingId: string, userId: string): Promise<Ping | null>;
}
