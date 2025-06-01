import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";

export const useUserInformation = (id: string) => {
  const {
    data: userInformation,
    isLoading: isLoadingUserInformation,
    error: errorUserInformation,
  } = useQuery({
    queryKey: ["user-information", id],
    queryFn: async () => await apiClient.GetUserInformation(id),
  });

  return { userInformation, isLoadingUserInformation, errorUserInformation };
};
