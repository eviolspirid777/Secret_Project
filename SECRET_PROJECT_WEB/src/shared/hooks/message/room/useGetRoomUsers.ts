import { apiClient } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useGetRoomUsers = (roomId: string | null) => {
  const {
    data: roomUsers,
    isLoading: isLoadingRoomUsers,
    error: errorRoomUsers,
  } = useQuery({
    queryKey: ["roomUsers", roomId],
    queryFn: () => apiClient.GetRoomUsers(roomId ?? ""),
    refetchOnWindowFocus: false,
    enabled: !!roomId,
  });

  return { roomUsers, isLoadingRoomUsers, errorRoomUsers };
};
