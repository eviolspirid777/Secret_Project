export type AddMessageReactionRequest = {
  emotion: string;
  userId: string;
  messageId: string;
};

export type AddChannelMessageReactionRequest = {
  emotion: string;
  userId: string;
  channelMessageId: string;
};
