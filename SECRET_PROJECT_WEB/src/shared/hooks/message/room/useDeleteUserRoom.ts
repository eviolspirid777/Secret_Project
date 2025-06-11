import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import type { DeleteUserRoomRequest } from "@/types/UserRoom/UserRoom";

export const useDeleteUserRoom = () => {
  const {
    mutateAsync: deleteUserRoomAsync,
    isPending: isDeleteUserRoomPending,
  } = useMutation({
    mutationKey: ["deleteUserRoom"],
    mutationFn: (data: DeleteUserRoomRequest) => apiClient.DeleteUserRoom(data),
  });

  return {
    deleteUserRoomAsync,
    isDeleteUserRoomPending,
  };
};
