import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

export const useChangeHeadphonesState = () => {
  const { mutateAsync: changeHeadphonesStateAsync,
    isPending: isChangeHeadphonesStatePending,
    isError: isChangeHeadphonesStateError,
    error: changeHeadphonesStateError,
  } = useMutation({
    mutationKey: ["changeHeadphonesState"],
    mutationFn: (id: string) => apiClient.ChangeHeadphonesState(id),
  });

  return {
    changeHeadphonesStateAsync,
    isChangeHeadphonesStatePending,
    isChangeHeadphonesStateError,
    changeHeadphonesStateError,
  };
};
