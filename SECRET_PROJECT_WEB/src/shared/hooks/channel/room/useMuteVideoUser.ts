import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient";

type RoomMuteVideoUserRequest = {
  channelId: string;
  userId: string;
};

export const useMuteVideoUser = () => {
  const {
    mutateAsync: muteVideoUserAsync,
    isPending: isMuteVideoUserLoading,
    isSuccess: isMuteVideoUserSuccess,
    isError: isMuteVideoUserError,
  } = useMutation({
    mutationKey: ["muteVideoUser"],
    mutationFn: async ({ channelId, userId }: RoomMuteVideoUserRequest) =>
      await apiClient.RoomMuteVideoUser(channelId, userId),
  });

  return {
    muteVideoUserAsync,
    isMuteVideoUserLoading,
    isMuteVideoUserSuccess,
    isMuteVideoUserError,
  };
};
