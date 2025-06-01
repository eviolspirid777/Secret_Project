import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import type { MessageDeleteRequest } from "@/types/Message/Message";

export const useDeleteMessage = () => {
  const {
    mutate: deleteMessage,
    isPending: isDeletingMessage,
    error: errorDeletingMessage,
    mutateAsync: deleteMessageAsync,
  } = useMutation({
    mutationKey: ["delete-message"],
    mutationFn: (data: MessageDeleteRequest) => apiClient.DeleteMessage(data),
  });

  return {
    deleteMessage,
    isDeletingMessage,
    errorDeletingMessage,
    deleteMessageAsync,
  };
};
