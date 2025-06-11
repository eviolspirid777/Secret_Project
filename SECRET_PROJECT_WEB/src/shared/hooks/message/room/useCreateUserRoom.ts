import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";

export const useCreateUserRoom = () => {
  return useMutation({
    mutationKey: ["createUserRoom"],
    mutationFn: (userId: string) => apiClient.CreateUserRoom(userId),
  });
};
