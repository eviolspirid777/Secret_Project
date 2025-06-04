import type { Status } from "@/types/Status/Status";

export type ChangeUserStatusRequest = {
  userId: string;
  status: Status;
};
