import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

export const useAddMessage = () => {
  const {
    mutate: addMessage,
    isPending: isAddingMessage,
    error: errorAddingMessage,
    mutateAsync: addMessageAsync,
  } = useMutation({
    mutationKey: ["add-message"],
    mutationFn: (data: FormData) => apiClient.AddMessage(data),
  });

  return {
    addMessage,
    isAddingMessage,
    errorAddingMessage,
    addMessageAsync,
  };
};
