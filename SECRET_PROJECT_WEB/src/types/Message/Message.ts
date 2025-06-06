export type Message = {
  id: string;
  content: string;
  senderId: string;
  reciverId: string;
  sentAt: string;
};

export type MessageAddRequest = {
  senderId: string;
  reciverId: string;
  content: string;
};

export type MessageDeleteRequest = {
  messageId: string;
  forAllUsers: boolean;
};

export type GetMessagesRequest = {
  firstUserId: string;
  secondUserId: string;
};
