export interface ISendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface IEmailServiceClient {
  sendEmail: (params: ISendEmailParams) => Promise<void>;
}
