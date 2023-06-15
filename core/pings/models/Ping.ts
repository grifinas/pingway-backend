import {
  NewPingReminder,
  PingReminder,
  PingReminderModel,
} from "@core/pings/models/PingReminder";

export type NewPing = {
  name: string;
  message: string;
  userId: string;
  dateTime: string;
  reminders: NewPingReminder[];
};

export type Ping = NewPing & {
  id: string;
  reminders: PingReminder[];
};

export type PingModel = {
  PingId: string;
  Name: string;
  Message: string;
  UserId: string;
  DateTime: string;
  Reminders: PingReminderModel[];
};
