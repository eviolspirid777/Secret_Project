export type UserRoom = {
  id: string;
  mutedAudioUserIds: string[];
  mutedVideoUserIds: string[];
  leftUserId: string;
  rightUserId: string;
};

export type DeleteUserRoomRequest = {
  roomId: string;
};

export type JoinUserRoomRequest = {
  roomId: string;
  userId: string;
};

export type CreateUserRoomRequest = {
  fromUserId: string;
  toUserId: string;
};

export type GetUserRoomInformationRequest = {
  leftUserId: string;
  rightUserId: string;
};
