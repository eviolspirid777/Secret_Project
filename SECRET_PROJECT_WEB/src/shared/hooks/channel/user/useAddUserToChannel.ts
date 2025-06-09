import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

type AddUserToChannelRequest = {
  channelId: string;
  userId: string;
};

export const useAddUserToChannel = () => {
  const {
    mutateAsync: addUserToChannelAsync,
    isPending: isAddUserToChannelPending,
    isSuccess: isAddUserToChannelSuccess,
    isError: isAddUserToChannelError,
  } = useMutation({
    mutationFn: async (data: AddUserToChannelRequest) =>
      await apiClient.AddUserToChannel(data.channelId, data.userId),
  });

  return {
    addUserToChannelAsync,
    isAddUserToChannelPending,
    isAddUserToChannelSuccess,
    isAddUserToChannelError,
  };
};
