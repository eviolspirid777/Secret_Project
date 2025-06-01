export type Message = {
  message: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
};

export type MessageAddRequest = {
  channelId: string;
  messages: MessageDto[];
};

export type MessageDto = {
  id: string;
  content: string;
  senderId: string;
  channelId: string;
};

export type MessageDeleteRequest = {
  channelId: string;
  messageId: string;
};
