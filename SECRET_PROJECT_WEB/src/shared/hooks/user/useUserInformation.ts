import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";

export const useUserInformation = (id: string) => {
  const {
    data: userInformation,
    isLoading: isLoadingUserInformation,
    isSuccess: isSuccessUserInformation,
    error: errorUserInformation,
    refetch: refetchUserInformation,
  } = useQuery({
    queryKey: ["user-information", id],
    queryFn: async () => await apiClient.GetUserInformation(id),
    refetchOnWindowFocus: true,
  });

  return {
    userInformation,
    isLoadingUserInformation,
    errorUserInformation,
    isSuccessUserInformation,
    refetchUserInformation,
  };
};
