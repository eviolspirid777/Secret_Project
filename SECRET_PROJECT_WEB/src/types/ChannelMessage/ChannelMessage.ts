import type {
  Message,
  MessageReaction,
  RepliedMessage,
} from "../Message/Message";

export const isChannelMessage = (
  message: Message | ChannelMessage
): message is ChannelMessage => {
  return typeof message === "object" && "file" in message;
};

export type ChannelMessage = {
  id: string;
  content?: string;
  sentAt: string;
  senderId: string;
  channelId: string;
  file?: File;
  repliedMessage?: RepliedMessage;
  reactions?: MessageReaction[];
};

type File = {
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
};
