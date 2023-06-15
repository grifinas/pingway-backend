import { Ping } from "@core/pings/models";

export interface IPingsRepository {
  addPing(ping: Ping): Promise<void>;
  getPingById(id: string, userId: string): Promise<Ping | null>;
  getCurrentPings(data: Pick<Ping, "userId">): Promise<Ping[]>;
  nextIdentity(): string;
}
