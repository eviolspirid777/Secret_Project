import { apiClient } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useGetChannels = () => {
  useQuery({
    queryKey: ["channels"],
    queryFn: async () => await apiClient.GetChannels(),
  });
};
