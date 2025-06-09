import { apiClient } from "@/api/apiClient";
import type { GetMessagesRequest } from "@/types/Message/Message";
import { useQuery } from "@tanstack/react-query";

export const useGetMessages = (data: GetMessagesRequest) => {
  const {
    data: messages,
    isLoading: isLoadingMessages,
    error: errorMessages,
    isError: isErrorMessages,
    isSuccess: isSuccessMessages,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["messages", data.firstUserId, data.secondUserId],
    queryFn: async () => await apiClient.GetMessages(data),
    refetchOnWindowFocus: false,
  });

  return {
    messages,
    isLoadingMessages,
    errorMessages,
    isErrorMessages,
    isSuccessMessages,
    refetchMessages,
  };
};
