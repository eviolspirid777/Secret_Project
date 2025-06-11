import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import type { GetUserRoomInformationRequest } from "@/types/UserRoom/UserRoom";

export const useGetUserRoomInformation = ({
  leftUserId,
  rightUserId,
}: GetUserRoomInformationRequest) => {
  const {
    data: userRoomInformation,
    isLoading: isGetUserRoomInformationLoading,
    isSuccess: isGetUserRoomInformationSuccess,
    refetch: refetchGetUserRoomInformation,
  } = useQuery({
    queryKey: ["userRoomInformation"],
    queryFn: async () =>
      await apiClient.GetUserRoomInformation({ leftUserId, rightUserId }),
    enabled: !!leftUserId && !!rightUserId,
    refetchOnWindowFocus: false,
  });

  return {
    userRoomInformation,
    isGetUserRoomInformationLoading,
    isGetUserRoomInformationSuccess,
    refetchGetUserRoomInformation,
  };
};
