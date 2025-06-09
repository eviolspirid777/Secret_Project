import { apiClient } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useGetChannelInformation = (id: string) => {
  const {
    data: channelInformation,
    isLoading: isChannelInformationLoading,
    error: channelInformationError,
  } = useQuery({
    queryKey: ["channel-information", id],
    queryFn: async () => await apiClient.GetChannelInformation(id),
    enabled: !!id,
  });

  return {
    channelInformation,
    isChannelInformationLoading,
    channelInformationError,
  };
};
