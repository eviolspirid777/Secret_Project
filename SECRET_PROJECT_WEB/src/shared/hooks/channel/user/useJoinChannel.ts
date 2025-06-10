import { apiClient } from "@/api/apiClient";
import type { JoinChannelRequest } from "@/types/Channel/Channel";
import { useMutation } from "@tanstack/react-query";

export const useJoinChannel = () => {
  const { mutateAsync: joinChannelAsync, isPending: isJoinChannelPending } =
    useMutation({
      mutationKey: ["join-channel"],
      mutationFn: async (data: JoinChannelRequest) =>
        await apiClient.JoinChannel(data),
    });

  return {
    joinChannelAsync,
    isJoinChannelPending,
  };
};
