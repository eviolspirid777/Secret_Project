export type ChannelMessage = {
  id: string;
  content?: string;
  sentAt: string;
  senderId: string;
  channelId: string;
  file?: File;
};

type File = {
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
};
