import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";

export const useFriendRequests = () => {
  const {
    data: friendRequests,
    mutate: fetchFriendsRequests,
    isSuccess: isSuccessFriendRequests,
    isError: isErrorFriendRequests,
  } = useMutation({
    mutationKey: ["friends-requests"],
    mutationFn: async () =>
      await apiClient.GetFriendRequests(localStorageService.getUserId() ?? ""),
  });

  return {
    friendRequests,
    fetchFriendsRequests,
    isSuccessFriendRequests,
    isErrorFriendRequests,
  };
};
