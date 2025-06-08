import type { ChannelMessage } from "./ChannelMessage";

export type AddChannelMessageRequest = {
  channelId: string;
  message: ChannelMessage;
};
