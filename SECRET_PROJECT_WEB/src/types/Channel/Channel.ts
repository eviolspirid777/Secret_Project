import type { ChannelMessage } from "../ChannelMessage/ChannelMessage";
import type { ChannelUser } from "../ChannelUser/ChannelUser";

export type Channel = {
  users: ChannelUser[];
  messages: ChannelMessage[];
};

export type ChannelDto = {
  id: string;
  name: string;
  channelAvatarUrl: string;
  createdAt: string;
};

export type AddChannelRequest = {
  name: string;
  channelAvatarUrl: string;
  adminId: string;
};

export type JoinChannelRequest = {
  userId: string;
  channelId: string;
};
