import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

export const useChangeMicrophoneState = () => {
  const { mutateAsync: changeMicrophoneStateAsync,
    isPending: isChangeMicrophoneStatePending,
    isError: isChangeMicrophoneStateError,
    error: changeMicrophoneStateError,
  } = useMutation({
    mutationKey: ["changeMicrophoneState"],
    mutationFn: (id: string) => apiClient.ChangeMicrophoneState(id),
  });

  return {
    changeMicrophoneStateAsync,
    isChangeMicrophoneStatePending,
    isChangeMicrophoneStateError,
    changeMicrophoneStateError,
  };
};
