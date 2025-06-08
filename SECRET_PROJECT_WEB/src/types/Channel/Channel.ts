import type { ChannelMessage } from "../ChannelMessage/ChannelMessage";
import type { ChannelUser } from "../ChannelUser/ChannelUser";

export type Channel = {
  users: ChannelUser[];
  messages: ChannelMessage[];
};
