import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient";

export const useCreateRoom = () => {
  const {
    mutateAsync: createRoomAsync,
    isPending: isCreateRoomLoading,
    isSuccess: isCreateRoomSuccess,
    isError: isCreateRoomError,
  } = useMutation({
    mutationKey: ["createRoom"],
    mutationFn: async (channelId: string) =>
      await apiClient.CreateRoom(channelId),
  });

  return {
    createRoomAsync,
    isCreateRoomLoading,
    isCreateRoomSuccess,
    isCreateRoomError,
  };
};
