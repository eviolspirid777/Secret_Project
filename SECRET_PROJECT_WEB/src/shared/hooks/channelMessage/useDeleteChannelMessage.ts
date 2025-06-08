import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import type { DeleteChannelMessageRequest } from "@/types/ChannelMessage/DeleteChannelMessageRequest";

export const useDeleteChannelMessage = () => {
  const {
    mutateAsync: deleteChannelMessageAsync,
    isPending: isDeleteChannelMessageLoading,
    error: deleteChannelMessageError,
  } = useMutation({
    mutationFn: async (data: DeleteChannelMessageRequest) =>
      await apiClient.DeleteChannelMessage(data),
  });

  return {
    deleteChannelMessageAsync,
    isDeleteChannelMessageLoading,
    deleteChannelMessageError,
  };
};
