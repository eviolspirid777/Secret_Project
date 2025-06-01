import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import type { FriendRequest } from "@/types/Friend/Friend";

export const useAcceptFriendRequest = () => {
  const {
    mutate: acceptFriendRequest,
    isPending: isAcceptingFriendRequest,
    error: errorAcceptingFriendRequest,
    mutateAsync: acceptFriendRequestAsync,
  } = useMutation({
    mutationKey: ["accept-friend-request"],
    mutationFn: (data: FriendRequest) => apiClient.AcceptFriendRequest(data),
  });

  return {
    acceptFriendRequest,
    isAcceptingFriendRequest,
    errorAcceptingFriendRequest,
    acceptFriendRequestAsync,
  };
};
