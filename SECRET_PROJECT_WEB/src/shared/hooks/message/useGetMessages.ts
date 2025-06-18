import { apiClient } from "@/api/apiClient";
import type { GetMessagesRequest } from "@/types/Message/Message";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

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
    isFetchedAfterMount,
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

  useEffect(() => {
    if (isFetchedAfterMount) {
      console.log("Fetched");
    }
  }, [isFetchedAfterMount]);

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
