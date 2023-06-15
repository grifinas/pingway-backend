import { PingReminder, PingReminderModel } from "@core/pings/models";

export interface IPingReminderMapper {
  toModel(dto: PingReminder): PingReminderModel;
  toDto(item: PingReminderModel): PingReminder;
}
