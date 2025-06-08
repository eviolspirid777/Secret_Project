import { apiClient } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useGetChannelMessages = (channelId: string) => {
  const {
    data: channelMessages,
    isLoading: isChannelMessagesLoading,
    error: channelMessagesError,
  } = useQuery({
    queryKey: ["channel-messages", channelId],
    queryFn: async () => await apiClient.GetChannelMessages(channelId),
    enabled: !!channelId,
  });

  return {
    channelMessages,
    isChannelMessagesLoading,
    channelMessagesError,
  };
};
