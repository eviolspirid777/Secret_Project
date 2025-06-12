import type { Status } from "@/types/Status/Status";

export type User = {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  status: Status;
  states: {
    isMicrophoneMuted: boolean;
    isHeadphonesMuted: boolean;
  };
};

export type UserShortDto = {
  id: string;
  name: string;
  status: string;
  avatar: string;
};
