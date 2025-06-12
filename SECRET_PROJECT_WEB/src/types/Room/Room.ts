export type Room = {
  id: string;
  mutedAudioUserIds: string[];
  mutedVideoUserIds: string[];
  blockedUsers: string[];
};

export type UserRoom = {
  id: string;
  leftUserId: string;
  rightUserId: string;
};
