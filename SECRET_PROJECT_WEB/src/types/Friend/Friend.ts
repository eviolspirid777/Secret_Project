import type { Status } from "@/types/Status/Status";

export type Friend = {
  id: string;
  name: string;
  avatar?: string;
  status: Status;
};

export type FriendRequest = {
  fromUserId: string;
  toUserId: string;
};
