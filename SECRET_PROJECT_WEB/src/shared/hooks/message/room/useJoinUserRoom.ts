import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";
import type { JoinUserRoomRequest } from "@/types/UserRoom/UserRoom";

export const useJoinUserRoom = () => {
  const {
    mutateAsync: joinUserRoomAsync,
    isPending: isJoinUserRoomLoading,
    isSuccess: isJoinUserRoomSuccess,
    isError: isJoinUserRoomError,
  } = useMutation({
    mutationKey: ["joinUserRoom"],
    mutationFn: async (data: JoinUserRoomRequest) =>
      await apiClient.JoinUserRoom(data),
  });

  return {
    joinUserRoomAsync,
    isJoinUserRoomLoading,
    isJoinUserRoomSuccess,
    isJoinUserRoomError,
  };
};
