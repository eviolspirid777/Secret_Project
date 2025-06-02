import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import { useDispatch } from "react-redux";
import { setFriends } from "@/store/slices/Friends.slice";
import { useEffect } from "react";
export const useGetUserFriends = (id: string) => {
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (userFriendsSuccess) {
      dispatch(setFriends(userFriends));
    }
  }, [userFriendsSuccess]);

  return {
    userFriends,
    refetchUserFriends,
    userFriendsSuccess,
    userFriendsError,
    userFriendsLoading,
  };
};
