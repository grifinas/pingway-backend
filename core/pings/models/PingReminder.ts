export enum PingReminderType {
  Sms = "Sms",
  Email = "Email",
}

export type NewPingReminder = {
  pingId: string;
  dateTime: string;
  type: PingReminderType;
  userId: string;
};

export type PingReminder = NewPingReminder & {
  id: string;
  isSent: boolean;
};

export type PingReminderModel = {
  PingReminderId: string;
  PingId: string;
  UserId: string;
  Type: PingReminderType;
  DateTime: string;
  IsSent: boolean;
};
