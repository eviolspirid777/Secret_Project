import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient";

export const useDeleteRoom = () => {
  const {
    mutateAsync: deleteRoomAsync,
    isPending: isDeleteRoomLoading,
    isSuccess: isDeleteRoomSuccess,
    isError: isDeleteRoomError,
  } = useMutation({
    mutationKey: ["deleteRoom"],
    mutationFn: async (channelId: string) =>
      await apiClient.DeleteRoom(channelId),
  });

  return {
    deleteRoomAsync,
    isDeleteRoomLoading,
    isDeleteRoomSuccess,
    isDeleteRoomError,
  };
};
