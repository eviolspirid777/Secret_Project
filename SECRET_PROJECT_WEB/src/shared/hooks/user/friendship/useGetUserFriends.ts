import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";

export const useGetUserFriends = (id: string) => {
  const {
    data: userFriends,
    refetch: refetchUserFriends,
    isSuccess: userFriendsSuccess,
    isError: userFriendsError,
    isLoading: userFriendsLoading,
  } = useQuery({
    queryKey: ["user-friends", id],
    queryFn: async () => apiClient.GetUserFriends(id),
  });

  // useEffect(() => {
  //   const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
  //     if (event?.query.queryKey[0] === "user-friends" && userFriends) {
  //       dispatch(setFriends(userFriends));
  //     }
  //   });

  //   if (userFriendsSuccess) {
  //     dispatch(setFriends(userFriends));
  //   }

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [userFriendsSuccess, userFriends, queryClient, dispatch]);

  return {
    userFriends,
    refetchUserFriends,
    userFriendsSuccess,
    userFriendsError,
    userFriendsLoading,
  };
};
