import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";

export const useUserShortInformation = (email: string) => {
  const {
    data: userShortInformation,
    isLoading: isLoadingUserShortInformation,
    error: errorUserShortInformation,
  } = useQuery({
    queryKey: ["userShortInformation", email],
    queryFn: async () => await apiClient.GetUserShortInformation(email),
  });

  return {
    userShortInformation,
    isLoadingUserShortInformation,
    errorUserShortInformation,
  };
};
