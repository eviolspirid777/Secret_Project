import { isNextDay } from "@/shared/helpers/timeFormater/isNextDay";
import dayjs from "dayjs";
import { memo, useCallback, useEffect, useRef, type FC } from "react";
import { Message } from "./Message/Message";
import { useDeleteMessage } from "@/shared/hooks/message/useDeleteMessage";
import { getFriendById } from "@/store/slices/Friends.slice";
import { getUser } from "@/store/slices/User.slice";
import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

import styles from "./styles.module.scss";
import { useGetMessages } from "@/shared/hooks/message/useGetMessages";
import { useInView } from "react-intersection-observer";
import { setSelectedChatId } from "@/store/slices/SelectedChatId.slice";
import { removeUnreadedMessagesUserId } from "@/store/slices/UnreadedMessagesUsersId.slice";
import { getMessages, setMessages } from "@/store/slices/Message.slice";

type MessagesProps = {
  friendId: string;
};

export const Messages: FC<MessagesProps> = memo(({ friendId }) => {
  const friend = useSelector((state: RootState) =>
    getFriendById(state, friendId)
  );
  const user = useSelector((state: RootState) => getUser(state));
  const messages = useSelector((state: RootState) =>
    getMessages(state, friendId)
  );

  const dispatch = useDispatch();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

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
    if (inView) fetchNextMessages();
  }, [inView]);

  useEffect(() => {
    refetchMessages();
    dispatch(removeUnreadedMessagesUserId(friendId));
    dispatch(setSelectedChatId(friendId));

    return () => {
      dispatch(setSelectedChatId(""));
    };
  }, [friendId]);

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

  // useEffect(() => {
  //   if (messagesContainerRef.current) {
  //     messagesContainerRef.current.scrollTo({
  //       top: messagesContainerRef.current.scrollHeight,
  //       behavior: "smooth",
  //     });
  //   }
  // }, [messages]);

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
      {messages?.map((message, id, messages) => {
        if (
          (messages[id - 1] &&
            isNextDay(message.sentAt, messages[id - 1]?.sentAt)) ||
          messages[id - 1] === undefined
        ) {
          return (
            <>
              <div className={styles["friend-chat__messages__date"]}>
                {dayjs(message.sentAt).format("DD.MM")}
              </div>
              <Message
                key={id}
                message={message}
                ref={id + 1 === messages.length ? ref : undefined}
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
            key={id}
            message={message}
            ref={id + 1 === messages.length ? ref : undefined}
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
