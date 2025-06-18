import { apiClient } from "@/api/apiClient";
import { messageSignalRServiceInstance } from "@/shared/services/SignalR/Messages/MessageSignalRService";
import type { GetMessagesRequest, Message } from "@/types/Message/Message";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export const useGetMessages = (data: GetMessagesRequest) => {
  const messageSignalRService = useRef(messageSignalRServiceInstance);

  const queryClient = useQueryClient();

  const {
    data: messages,
    isLoading: isLoadingMessages,
    isFetchingNextPage: isLoadingNextMessages,
    error: errorMessages,
    isError: isErrorMessages,
    isSuccess: isSuccessMessages,
    fetchNextPage: fetchNextMessages,
    refetch: refetchMessages,
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
  });

  messageSignalRService.current.onReceiveMessage((message) => {
    const previousMessages = queryClient.getQueryData([
      "messages",
    ]) as Message[];
    queryClient.setQueryData(["messages"], [...previousMessages, message]);
  });

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return {
    messages,
    isLoadingMessages,
    isLoadingNextMessages,
    errorMessages,
    isErrorMessages,
    isSuccessMessages,
    refetchMessages,
    fetchNextMessages,
  };
};
