export interface IMessageHandler<TMessage> {
  execute(messages: TMessage[]): Promise<void>;
}
