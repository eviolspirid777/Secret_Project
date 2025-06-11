import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient";

type RoomUnmuteUserAudioRequest = {
  channelId: string;
  userId: string;
};

export const useUnmuteUserAudio = () => {
  const {
    mutateAsync: unmuteUserAudioAsync,
    isPending: isUnmuteUserAudioLoading,
    isSuccess: isUnmuteUserAudioSuccess,
    isError: isUnmuteUserAudioError,
  } = useMutation({
    mutationKey: ["unmuteUserAudio"],
    mutationFn: async ({ channelId, userId }: RoomUnmuteUserAudioRequest) =>
      await apiClient.RoomUnmuteAudioUser(channelId, userId),
  });

  return {
    unmuteUserAudioAsync,
    isUnmuteUserAudioLoading,
    isUnmuteUserAudioSuccess,
    isUnmuteUserAudioError,
  };
};
