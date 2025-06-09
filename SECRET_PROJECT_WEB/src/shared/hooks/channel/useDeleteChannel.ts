import { apiClient } from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";

export const useDeleteChannel = () => {
  const {
    mutateAsync: deleteChannelAsync,
    isPending: isDeleteChannelPending,
    isSuccess: isDeleteChannelSuccess,
    isError: isDeleteChannelError,
  } = useMutation({
    mutationFn: async (id: string) => await apiClient.DeleteChannel(id),
  });

  return {
    deleteChannelAsync,
    isDeleteChannelPending,
    isDeleteChannelSuccess,
    isDeleteChannelError,
  };
};
