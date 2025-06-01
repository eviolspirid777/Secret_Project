import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import type { FriendRequest } from "@/types/Friend/Friend";

export const useSendFriendRequest = () => {
  const {
    mutate: sendFriendRequest,
    isPending: isSendingFriendRequest,
    error: errorSendingFriendRequest,
    mutateAsync: sendFriendRequestAsync,
  } = useMutation({
    mutationFn: (data: FriendRequest) => apiClient.SendFriendRequest(data),
  });

  return {
    sendFriendRequest,
    isSendingFriendRequest,
    errorSendingFriendRequest,
    sendFriendRequestAsync,
  };
};
