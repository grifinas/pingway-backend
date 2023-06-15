import { IPingReminderMapper } from "@core/pings/mappers/IPingReminderMapper";

export const PingReminderMapper: IPingReminderMapper = {
  toDto(item) {
    return {
      id: item.PingReminderId,
      isSent: item.IsSent,
      userId: item.UserId,
      pingId: item.PingId,
      type: item.Type,
      dateTime: item.DateTime,
    };
  },
  toModel(dto) {
    return {
      PingReminderId: dto.id,
      IsSent: dto.isSent,
      UserId: dto.userId,
      PingId: dto.pingId,
      Type: dto.type,
      DateTime: new Date(dto.dateTime).toISOString(),
    };
  },
};
