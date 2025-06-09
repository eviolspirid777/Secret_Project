import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

export const useAddChannelMessage = () => {
  const {
    mutateAsync: addChannelMessageAsync,
    isPending: isAddChannelMessageLoading,
    error: addChannelMessageError,
  } = useMutation({
    mutationFn: async (data: FormData) =>
      await apiClient.AddChannelMessage(data),
  });

  return {
    addChannelMessageAsync,
    isAddChannelMessageLoading,
    addChannelMessageError,
  };
};
