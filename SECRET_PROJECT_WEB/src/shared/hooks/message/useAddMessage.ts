import { apiClient } from "@/api/apiClient";
import type { MessageAddRequest } from "@/types/Message/Message";
import { useMutation } from "@tanstack/react-query";

export const useAddMessage = () => {
  const {
    mutate: addMessage,
    isPending: isAddingMessage,
    error: errorAddingMessage,
    mutateAsync: addMessageAsync,
  } = useMutation({
    mutationKey: ["add-message"],
    mutationFn: (data: MessageAddRequest) => apiClient.AddMessage(data),
  });

  return {
    addMessage,
    isAddingMessage,
    errorAddingMessage,
    addMessageAsync,
  };
};
