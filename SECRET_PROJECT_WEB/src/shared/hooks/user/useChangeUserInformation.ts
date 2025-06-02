import { apiClient } from "@/api/apiClient";
import type { ChangeUserInformationRequest } from "@/types/User/ChangeUserInformationRequest";
import { useMutation } from "@tanstack/react-query";

export const useChangeUserInformation = () => {
  const {
    mutateAsync: changeUserInformationAsync,
    isPending: isChangingUserInformation,
    isError: isChangingUserInformationError,
    error: changingUserInformationError,
  } = useMutation({
    mutationKey: ["changeUserInformation"],
    mutationFn: (data: ChangeUserInformationRequest) => {
      return apiClient.ChangeUserInformation(data);
    },
  });

  return {
    changeUserInformationAsync,
    isChangingUserInformation,
    isChangingUserInformationError,
    changingUserInformationError,
  };
};
