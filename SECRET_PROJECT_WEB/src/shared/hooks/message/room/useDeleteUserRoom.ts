import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";

export const useDeleteUserRoom = () => {
  return useMutation({
    mutationKey: ["deleteUserRoom"],
    mutationFn: (userId: string) => apiClient.DeleteUserRoom(userId),
  });
};
