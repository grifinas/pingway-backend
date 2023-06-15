import { NewPing, Ping } from "@core/pings/models";

export interface IPingsService {
  getUserUnsentPings(userId: string): Promise<Ping[]>;
  getUserPingById(pingId: string, userId: string): Promise<Ping | null>;
  addPing(data: NewPing): Promise<Ping>;
}
