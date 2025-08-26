import { apiClient } from "@/api/apiClient";
import type { GetMessagesRequest } from "@/types/Message/Message";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetMessages = (data: GetMessagesRequest) => {
  const {
    data: messages,
    isLoading: isLoadingMessages,
    isFetchingNextPage: isLoadingNextMessages,
    error: errorMessages,
    isError: isErrorMessages,
    isSuccess: isSuccessMessages,
    fetchNextPage: fetchNextMessages,
    refetch: refetchMessages,
    isFetched: isMessagesFetched,
  } = useInfiniteQuery({
    queryKey: ["messages"],
    queryFn: async ({ pageParam }) =>
      await apiClient.GetMessages({
        firstUserId: data.firstUserId,
        secondUserId: data.secondUserId,
        page: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 20) {
        return undefined;
      }
      return allPages.length;
    },
    refetchOnWindowFocus: false,
  });

  return {
    messages,
    isMessagesFetched,
    isLoadingMessages,
    isLoadingNextMessages,
    errorMessages,
    isErrorMessages,
    isSuccessMessages,
    refetchMessages,
    fetchNextMessages,
  };
};
