import { apiClient } from "@/api/apiClient";
import type { AddChannelRequest } from "@/types/Channel/Channel";
import { useMutation } from "@tanstack/react-query";

export const useAddChannel = () => {
  const {
    mutateAsync: addChannelAsync,
    isPending: isAddChannelPending,
    isSuccess: isAddChannelSuccess,
    isError: isAddChannelError,
  } = useMutation({
    mutationFn: async (data: AddChannelRequest) =>
      await apiClient.AddChannel(data),
  });

  return {
    addChannelAsync,
    isAddChannelPending,
    isAddChannelSuccess,
    isAddChannelError,
  };
};
