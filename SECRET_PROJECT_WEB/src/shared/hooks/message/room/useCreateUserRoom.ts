import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import type { CreateUserRoomRequest } from "@/types/UserRoom/UserRoom";

export const useCreateUserRoom = () => {
  const {
    mutateAsync: createUserRoomAsync,
    isPending: isCreateUserRoomPending,
  } = useMutation({
    mutationKey: ["createUserRoom"],
    mutationFn: (data: CreateUserRoomRequest) => apiClient.CreateUserRoom(data),
  });

  return {
    createUserRoomAsync,
    isCreateUserRoomPending,
  };
};
