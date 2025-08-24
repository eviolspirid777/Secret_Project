import { apiClient } from "@/api/apiClient";
import type { AddChannelMessageReactionRequest } from "@/types/Reaction/Request";
import { useMutation } from "@tanstack/react-query";

export const useAddChannelMessageReaction = () => {
  const {
    mutateAsync: addChannelMessageReactionAsync,
    mutate: addChannelMessageReaction,
    isSuccess: isChannelMessageReactionSuccess,
    isError: isChannelMessageReactionError,
  } = useMutation({
    mutationKey: ["add-channel-message-reaction"],
    mutationFn: (data: AddChannelMessageReactionRequest) =>
      apiClient.AddChannelMessageReaction(data),
  });

  return {
    addChannelMessageReactionAsync,
    addChannelMessageReaction,
    isChannelMessageReactionSuccess,
    isChannelMessageReactionError,
  };
};
