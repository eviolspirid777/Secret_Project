import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";

export const useGetUserRoomInformation = (userId: string) => {
  return useQuery({
    queryKey: ["userRoomInformation", userId],
    queryFn: () => apiClient.GetUserRoomInformation(userId),
  });
};
