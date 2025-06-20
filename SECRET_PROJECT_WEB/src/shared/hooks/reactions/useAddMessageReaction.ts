import { apiClient } from "@/api/apiClient";
import type { AddMessageReactionRequest } from "@/types/Reaction/Request";
import { useMutation } from "@tanstack/react-query";

export const useAddMessageReaction = () => {
  const {
    mutateAsync: addMessageReactionAsync,
    mutate: addMessageReaction,
    isSuccess: isMessageReactionSuccess,
    isError: isMessageReactionError,
  } = useMutation({
    mutationKey: ["add-message-reaction"],
    mutationFn: (data: AddMessageReactionRequest) =>
      apiClient.AddMessageReaction(data),
  });

  return {
    addMessageReactionAsync,
    addMessageReaction,
    isMessageReactionSuccess,
    isMessageReactionError,
  };
};
