import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

export const useRemoveMessageReaction = () => {
  const {
    mutateAsync: removeMessageReactionAsync,
    mutate: removeMessageReaction,
    isSuccess: isMessageReactionSuccess,
    isError: isMessageReactionError,
  } = useMutation({
    mutationKey: ["remove-message-reaction"],
    mutationFn: apiClient.RemoveMessageReaction,
  });

  return {
    removeMessageReactionAsync,
    removeMessageReaction,
    isMessageReactionSuccess,
    isMessageReactionError,
  };
};
