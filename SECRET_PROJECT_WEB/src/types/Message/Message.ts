export type Message = {
  id: string;
  content?: string;
  senderId: string;
  reciverId: string;
  sentAt: string;
  file?: File;
  repliedMessage?: RepliedMessage;
  reactions?: MessageReaction[];
};

export type MessageReaction = {
  id: string;
  messageId: string;
  userId: string;
  emotion: string;
};

export type RepliedMessage = {
  repliedMessageId: string;
  senderName: string;
  content: string;
  file?: File;
};

export type File = {
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
};

export type MessageDeleteRequest = {
  messageId: string;
  forAllUsers: boolean;
};

export type GetMessagesRequest = {
  firstUserId: string;
  secondUserId: string;
  page?: number;
};
