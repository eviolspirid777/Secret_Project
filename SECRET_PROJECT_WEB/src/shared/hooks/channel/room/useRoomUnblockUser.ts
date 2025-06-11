import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

type RoomUnblockUserRequest = {
  channelId: string;
  userId: string;
};

export const useRoomUnblockUser = () => {
  const {
    mutateAsync: unblockUserAsync,
    isPending: isUnblockUserLoading,
    isSuccess: isUnblockUserSuccess,
    isError: isUnblockUserError,
  } = useMutation({
    mutationKey: ["unblockUser"],
    mutationFn: async ({ channelId, userId }: RoomUnblockUserRequest) =>
      await apiClient.RoomUnblockUser(channelId, userId),
  });

  return {
    unblockUserAsync,
    isUnblockUserLoading,
    isUnblockUserSuccess,
    isUnblockUserError,
  };
};
