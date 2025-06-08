import { apiClient } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useGetChannelUsers = (id: string | undefined) => {
  const {
    data: channelUsers,
    isLoading: isChannelUsersLoading,
    isSuccess: isChannelUsersSuccess,
    error: channelUsersError,
  } = useQuery({
    queryKey: ["channel-users", id],
    queryFn: async () => await apiClient.GetChannelUsers(id ?? ""),
    enabled: !!id,
  });

  return {
    channelUsers,
    isChannelUsersLoading,
    isChannelUsersSuccess,
    channelUsersError,
  };
};
