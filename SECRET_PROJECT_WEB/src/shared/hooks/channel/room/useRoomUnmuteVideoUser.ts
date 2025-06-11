import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient";

type RoomUnmuteVideoUserRequest = {
  channelId: string;
  userId: string;
};

export const useRoomUnmuteVideoUser = () => {
  const {
    mutateAsync: unmuteVideoUserAsync,
    isPending: isUnmuteVideoUserLoading,
    isSuccess: isUnmuteVideoUserSuccess,
    isError: isUnmuteVideoUserError,
  } = useMutation({
    mutationKey: ["unmuteVideoUser"],
    mutationFn: async ({ channelId, userId }: RoomUnmuteVideoUserRequest) =>
      await apiClient.RoomUnmuteVideoUser(channelId, userId),
  });

  return {
    unmuteVideoUserAsync,
    isUnmuteVideoUserLoading,
    isUnmuteVideoUserSuccess,
    isUnmuteVideoUserError,
  };
};
