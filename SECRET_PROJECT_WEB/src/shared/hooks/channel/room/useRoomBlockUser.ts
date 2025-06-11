import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

type RoomBlockUserRequest = {
  channelId: string;
  userId: string;
};

export const useRoomBlockUser = () => {
  const {
    mutateAsync: blockUserAsync,
    isPending: isBlockUserLoading,
    isSuccess: isBlockUserSuccess,
    isError: isBlockUserError,
  } = useMutation({
    mutationKey: ["blockUser"],
    mutationFn: async ({ channelId, userId }: RoomBlockUserRequest) =>
      await apiClient.RoomBlockUser(channelId, userId),
  });

  return {
    blockUserAsync,
    isBlockUserLoading,
    isBlockUserSuccess,
    isBlockUserError,
  };
};
