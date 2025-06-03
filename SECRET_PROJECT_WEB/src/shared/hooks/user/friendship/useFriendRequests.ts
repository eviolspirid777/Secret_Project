import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";

export const useFriendRequests = () => {
  const {
    data: friendRequests,
    isLoading: isLoadingFriendRequests,
    isSuccess: isSuccessFriendRequests,
    isError: isErrorFriendRequests,
  } = useQuery({
    queryKey: ["friends-requests"],
    queryFn: async () =>
      await apiClient.GetFriendRequests(localStorageService.getUserId() ?? ""),
  });

  return {
    friendRequests,
    isLoadingFriendRequests,
    isSuccessFriendRequests,
    isErrorFriendRequests,
  };
};
