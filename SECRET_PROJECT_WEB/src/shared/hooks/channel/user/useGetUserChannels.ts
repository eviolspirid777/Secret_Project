import { apiClient } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useGetUserChannels = (userId: string) => {
  const {
    data: userChannels,
    isLoading: isUserChannelsLoading,
    error: errorUserChannels,
  } = useQuery({
    queryKey: ["channels", userId],
    queryFn: async () => await apiClient.GetUserChannels(userId),
    enabled: !!userId,
  });

  return {
    userChannels,
    isUserChannelsLoading,
    errorUserChannels,
  };
};
