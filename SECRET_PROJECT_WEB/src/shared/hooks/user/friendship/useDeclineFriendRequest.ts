import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import type { FriendRequest } from "@/types/Friend/Friend";

export const useDeclineFriendRequest = () => {
  const {
    mutate: declineFriendRequest,
    isPending: isDecliningFriendRequest,
    error: errorDecliningFriendRequest,
    mutateAsync: declineFriendRequestAsync,
  } = useMutation({
    mutationKey: ["decline-friend-request"],
    mutationFn: (data: FriendRequest) => apiClient.DeclineFriendRequest(data),
  });

  return {
    declineFriendRequest,
    isDecliningFriendRequest,
    errorDecliningFriendRequest,
    declineFriendRequestAsync,
  };
};
