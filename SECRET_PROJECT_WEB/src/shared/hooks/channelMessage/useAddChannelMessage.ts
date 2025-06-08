import { apiClient } from "@/api/apiClient";
import type { AddChannelMessageRequest } from "@/types/ChannelMessage/AddChannelMessageRequest";
import { useMutation } from "@tanstack/react-query";

export const useAddChannelMessage = () => {
  const {
    mutateAsync: addChannelMessageAsync,
    isPending: isAddChannelMessageLoading,
    error: addChannelMessageError,
  } = useMutation({
    mutationFn: async (data: AddChannelMessageRequest) =>
      await apiClient.AddChannelMessage(data),
  });

  return {
    addChannelMessageAsync,
    isAddChannelMessageLoading,
    addChannelMessageError,
  };
};
