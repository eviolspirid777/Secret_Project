import { getUser } from "@/store/slices/User.slice";
import { useDispatch, useSelector } from "react-redux";
import { Message } from "./Message/Message";
import { getFriendById } from "@/store/slices/Friends.slice";
import type { RootState } from "@/store/store";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetMessages } from "@/shared/hooks/message/useGetMessages";
import { useAddMessage } from "@/shared/hooks/message/useAddMessage";
import { useDeleteMessage } from "@/shared/hooks/message/useDeleteMessage";
import { InputBlock } from "./InputBlock/InputBlock";
import {
  getMessages,
  setMessages as setMessagesAction,
} from "@/store/slices/Message.slice";
import { setSelectedChatId } from "@/store/slices/SelectedChatId.slice";

import styles from "./styles.module.scss";
import { removeUnreadedMessagesUserId } from "@/store/slices/UnreadedMessagesUsersId.slice";
import dayjs from "dayjs";
import { isNextDay } from "@/shared/helpers/timeFormater/isNextDay";

type MessageBlockProps = {
  friendId: string;
};

export const MessageBlock: FC<MessageBlockProps> = ({ friendId }) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const friend = useSelector((state: RootState) =>
    getFriendById(state, friendId)
  );
  const user = useSelector((state: RootState) => getUser(state));

  const messages = useSelector((state: RootState) =>
    getMessages(state, friendId)
  );

  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const {
    messages: messagesFromHook,
    isSuccessMessages,
    refetchMessages,
  } = useGetMessages({
    firstUserId: user?.userId ?? "",
    secondUserId: friendId,
  });

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
        setMessagesAction({
          senderId: friendId,
          messages: messagesFromHook,
        })
      );
    }
  }, [isSuccessMessages]);

  const { addMessageAsync } = useAddMessage();
  const { deleteMessageAsync } = useDeleteMessage();

  const sendMessage = useCallback(
    async (message: string | null, fileLocal?: File) => {
      if (friendId) {
        const formData = new FormData();
        if (fileLocal || file) {
          formData.append("file", fileLocal ?? file!);
          formData.append("fileType", fileLocal?.type ?? file!.type);
          formData.append("fileName", fileLocal?.name ?? file!.name);
        }
        formData.append("senderId", user?.userId ?? "");
        formData.append("reciverId", friendId);
        if (message) {
          formData.append("content", message);
        }

        await addMessageAsync(formData);
        setMessage("");
      }
    },
    [user, friendId, file, addMessageAsync]
  );

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

  const sendFile = useCallback((file: File | null) => {
    setFile(file);
  }, []);

  return (
    <>
      <div
        ref={messagesContainerRef}
        className={styles["friend-chat__messages"]}
      >
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
                  avatar={proceedAvatar(message.senderId)}
                  senderName={proceedSenderName(message.senderId)}
                  deleteMessage={deleteMessage}
                  isCurrentUser={message.senderId === user?.userId}
                />
              </>
            );
          }
          return (
            <Message
              key={id}
              message={message}
              avatar={proceedAvatar(message.senderId)}
              senderName={proceedSenderName(message.senderId)}
              deleteMessage={deleteMessage}
              isCurrentUser={message.senderId === user?.userId}
            />
          );
        })}
      </div>
      <InputBlock
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        sendFile={sendFile}
      />
    </>
  );
};
