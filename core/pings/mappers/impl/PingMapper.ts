import { PingReminderMapper } from "@core/pings/mappers/impl/PingReminderMapper";
import { IPingMapper } from "@core/pings/mappers/IPingMapper";
import { Ping, PingModel } from "@core/pings/models";

export const PingMapper: IPingMapper = {
  toModel(dto: Ping): PingModel {
    return {
      PingId: dto.id,
      Name: dto.name,
      Message: dto.message,
      UserId: dto.userId,
      DateTime: new Date(dto.dateTime).toISOString(),
      Reminders: dto.reminders.map(PingReminderMapper.toModel),
    };
  },
  toPartialModel(dto: Partial<Ping>): Partial<PingModel> {
    return {
      ...(dto.id && {
        PingId: dto.id,
      }),
      ...(dto.name && {
        Name: dto.name,
      }),
      ...(dto.message && {
        Message: dto.message,
      }),
      ...(dto.userId && {
        UserId: dto.userId,
      }),
      ...(dto.dateTime && {
        DateTime: new Date(dto.dateTime).toISOString(),
      }),
      ...(dto.reminders && {
        Reminders: dto.reminders.map(PingReminderMapper.toModel),
      }),
    };
  },
  toDto(item, reminders) {
    return {
      id: item.PingId,
      name: item.Name,
      message: item.Message,
      userId: item.UserId,
      dateTime: item.DateTime,
      reminders: reminders.map(PingReminderMapper.toDto),
    };
  },
};
