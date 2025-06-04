import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";
import type { ChangeUserStatusRequest } from "@/types/User/ChangeUserStatusRequest";

export const useChangeUserStatus = () => {
  const { mutateAsync: changeUserStatusAsync, mutate: changeUserStatus } =
    useMutation({
      mutationKey: ["changeUserStatus"],
      mutationFn: async (data: ChangeUserStatusRequest) =>
        await apiClient.ChangeUserStatus(data),
    });

  return {
    changeUserStatusAsync,
    changeUserStatus,
  };
};
