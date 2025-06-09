import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

type DeleteUserFromChannelRequest = {
  channelId: string;
  userId: string;
};

export const useDeleteUserFromChannel = () => {
  const {
    mutateAsync: deleteUserFromChannelAsync,
    isPending: isDeleteUserFromChannelPending,
    isSuccess: isDeleteUserFromChannelSuccess,
    isError: isDeleteUserFromChannelError,
  } = useMutation({
    mutationFn: async (data: DeleteUserFromChannelRequest) =>
      await apiClient.DeleteUserFromChannel(data.channelId, data.userId),
  });

  return {
    deleteUserFromChannelAsync,
    isDeleteUserFromChannelPending,
    isDeleteUserFromChannelSuccess,
    isDeleteUserFromChannelError,
  };
};
