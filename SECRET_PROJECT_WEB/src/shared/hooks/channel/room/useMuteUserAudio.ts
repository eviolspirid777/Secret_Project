import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient";

type RoomMuteUserAudioRequest = {
  channelId: string;
  userId: string;
};

export const useMuteUserAudio = () => {
  const {
    mutateAsync: muteUserAudioAsync,
    isPending: isMuteUserAudioLoading,
    isSuccess: isMuteUserAudioSuccess,
    isError: isMuteUserAudioError,
  } = useMutation({
    mutationKey: ["muteUserAudio"],
    mutationFn: async ({ channelId, userId }: RoomMuteUserAudioRequest) =>
      await apiClient.RoomMuteAudioUser(channelId, userId),
  });

  return {
    muteUserAudioAsync,
    isMuteUserAudioLoading,
    isMuteUserAudioSuccess,
    isMuteUserAudioError,
  };
};
