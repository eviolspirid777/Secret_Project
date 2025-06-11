import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient";

export const useRoomInformation = (channelId: string) => {
  const {
    data: room,
    isLoading: isRoomLoading,
    error: roomError,
  } = useQuery({
    queryKey: ["room", channelId],
    queryFn: async () => await apiClient.GetRoomInformation(channelId),
  });

  return { room, isRoomLoading, roomError };
};
