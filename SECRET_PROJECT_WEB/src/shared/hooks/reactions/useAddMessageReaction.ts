import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

export const useAddMessageReaction = () => {
  const {
    mutateAsync: addMessageReactionAsync,
    mutate: addMessageReaction,
    isSuccess: isMessageReactionSuccess,
    isError: isMessageReactionError,
  } = useMutation({
    mutationKey: ["add-message-reaction"],
    mutationFn: apiClient.AddMessageReaction,
  });

  return {
    addMessageReactionAsync,
    addMessageReaction,
    isMessageReactionSuccess,
    isMessageReactionError,
  };
};
