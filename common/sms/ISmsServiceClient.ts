export interface ISendSmsParams {
  /**
   * Note: email for now while SMS are not implemented
   */
  tel: string;
  text: string;
}

export interface ISmsServiceClient {
  sendSms: (params: ISendSmsParams) => Promise<void>;
}
