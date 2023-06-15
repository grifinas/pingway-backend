import { Ping, PingModel, PingReminderModel } from "@core/pings/models";

export interface IPingMapper {
  toModel(dto: Ping): PingModel;
  toPartialModel(dto: Partial<Ping>): Partial<PingModel>;
  toDto(item: PingModel, reminders: PingReminderModel[]): Ping;
}
