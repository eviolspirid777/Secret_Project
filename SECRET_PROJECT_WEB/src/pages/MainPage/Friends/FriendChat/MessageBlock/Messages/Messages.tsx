import { isNextDay } from "@/shared/helpers/timeFormater/isNextDay";
import dayjs from "dayjs";
import { memo, useCallback, useEffect, useRef, useState, type FC } from "react";
import { Message } from "./Message/Message";
import { useDeleteMessage } from "@/shared/hooks/message/useDeleteMessage";
import { getFriendById } from "@/store/slices/Friends.slice";
import { getUser } from "@/store/slices/User.slice";
import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useGetMessages } from "@/shared/hooks/message/useGetMessages";
import { useInView } from "react-intersection-observer";
import { setSelectedChatId } from "@/store/slices/SelectedChatId.slice";
import { removeUnreadedMessagesUserId } from "@/store/slices/UnreadedMessagesUsersId.slice";
import { getMessages, setMessages } from "@/store/slices/Message.slice";

import styles from "./styles.module.scss";

type MessagesProps = {
  friendId: string;
};

export const Messages: FC<MessagesProps> = memo(({ friendId }) => {
  const dispatch = useDispatch();
  const friend = useSelector((state: RootState) =>
    getFriendById(state, friendId)
  );
  const user = useSelector((state: RootState) => getUser(state));
  const messages = useSelector((state: RootState) =>
    getMessages(state, friendId)
  );

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialScrollDone = useRef(false);
  const prevScrollHeight = useRef<number | null>(null);
  const hasAutoScrolledRef = useRef(false);

  const [isReadyToLoadMore, setIsReadyToLoadMore] = useState(false);

  const { ref, inView } = useInView();
  const { deleteMessageAsync } = useDeleteMessage();

  const {
    messages: messagesFromHook,
    isSuccessMessages,
    refetchMessages,
    fetchNextMessages,
    isLoadingNextMessages,
  } = useGetMessages({
    firstUserId: user?.userId ?? "",
    secondUserId: friendId,
  });

  useEffect(() => {
    if (isSuccessMessages && messagesFromHook) {
      dispatch(
        setMessages({
          senderId: friendId,
          messages: messagesFromHook.pages.flat(),
        })
      );
    }
  }, [isSuccessMessages, messagesFromHook]);

  useEffect(() => {
    if (inView && isReadyToLoadMore && !isLoadingNextMessages) {
      const container = messagesContainerRef.current;
      if (container) {
        prevScrollHeight.current = container.scrollHeight;
      }
      fetchNextMessages();
    }
  }, [inView, isReadyToLoadMore]);

  useEffect(() => {
    refetchMessages();
    dispatch(removeUnreadedMessagesUserId(friendId));
    dispatch(setSelectedChatId(friendId));

    return () => {
      dispatch(setSelectedChatId(""));
    };
  }, [friendId]);

  useEffect(() => {
    if (!isInitialScrollDone.current && messages.length > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        // Обязательно даём время DOM отрисовать сообщения
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
          isInitialScrollDone.current = true;
          hasAutoScrolledRef.current = true;
          setIsReadyToLoadMore(true);
        }, 0);
      }
    }
  }, [messages.length]);

  const deleteMessage = useCallback(
    async (messageId: string, forAllUsers: boolean) => {
      await deleteMessageAsync({
        messageId,
        forAllUsers,
      });
    },
    []
  );

  const proceedAvatar = useCallback(
    (messageId: string) => {
      const message = messages?.find(
        (message) => message.senderId === messageId
      );
      if (message) {
        return friend?.avatar;
      }
      return user?.avatar;
    },
    [friend, user]
  );

  const proceedSenderName = useCallback(
    (messageId: string) => {
      if (friend?.userId === messageId) {
        return friend?.name;
      }
      return user?.name;
    },
    [friend, user]
  );

  return (
    <div ref={messagesContainerRef} className={styles["friend-chat__messages"]}>
      {messages?.map((message, index, messages) => {
        if (
          (messages[index - 1] &&
            isNextDay(message.sentAt, messages[index - 1]?.sentAt)) ||
          messages[index - 1] === undefined
        ) {
          return (
            <>
              <div className={styles["friend-chat__messages__date"]}>
                {dayjs(message.sentAt).format("DD.MM")}
              </div>
              <Message
                key={message.id}
                message={message}
                ref={index === 0 ? ref : undefined}
                avatar={proceedAvatar(message.senderId)}
                senderName={proceedSenderName(message.senderId)}
                deleteMessage={deleteMessage}
                isCurrentUser={message.senderId === user?.userId}
                isLoadingNextMessages={isLoadingNextMessages}
              />
            </>
          );
        }
        return (
          <Message
            key={message.id}
            message={message}
            ref={index === 0 ? ref : undefined}
            avatar={proceedAvatar(message.senderId)}
            senderName={proceedSenderName(message.senderId)}
            deleteMessage={deleteMessage}
            isCurrentUser={message.senderId === user?.userId}
            isLoadingNextMessages={isLoadingNextMessages}
          />
        );
      })}
    </div>
  );
});
