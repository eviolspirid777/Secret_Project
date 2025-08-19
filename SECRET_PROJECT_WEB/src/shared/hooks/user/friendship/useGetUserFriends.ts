import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";

export const useGetUserFriends = (id: string) => {
  const {
    data: userFriends,
    refetch: refetchUserFriends,
    isSuccess: userFriendsSuccess,
    isFetched: isUserFriendsFetched,
    isRefetching: isUserFriendsRefetching,
    isError: userFriendsError,
    isLoading: userFriendsLoading,
  } = useQuery({
    queryKey: ["user-friends", id],
    queryFn: async () => apiClient.GetUserFriends(id),
  });

  return {
    userFriends,
    isUserFriendsFetched,
    isUserFriendsRefetching,
    refetchUserFriends,
    userFriendsSuccess,
    userFriendsError,
    userFriendsLoading,
  };
};
