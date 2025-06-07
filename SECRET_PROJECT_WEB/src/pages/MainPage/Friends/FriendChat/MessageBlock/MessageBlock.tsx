import { getUser } from "@/store/slices/User.slice";
import { useSelector } from "react-redux";
import { Message } from "./Message/Message";
import { getFriendById } from "@/store/slices/Friends.slice";
import type { RootState } from "@/store/store";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { messageSignalRServiceInstance } from "@/shared/services/SignalR/Messages/MessageSignalRService";
import { useMessageAlert } from "@/shared/hooks/messageAlert/useMessageAlert";
import { useGetMessages } from "@/shared/hooks/message/useGetMessages";
import { useAddMessage } from "@/shared/hooks/message/useAddMessage";
import type { Message as MessageType } from "@/types/Message/Message";
import { useDeleteMessage } from "@/shared/hooks/message/useDeleteMessage";
import { InputBlock } from "./InputBlock/InputBlock";

import styles from "./styles.module.scss";

type MessageBlockProps = {
  friendId: string;
};

export const MessageBlock: FC<MessageBlockProps> = ({ friendId }) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const friend = useSelector((state: RootState) =>
    getFriendById(state, friendId)
  );
  const user = useSelector((state: RootState) => getUser(state));

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const { messages: messagesFromHook, isSuccessMessages } = useGetMessages({
    firstUserId: user?.userId ?? "",
    secondUserId: friendId,
  });

  useEffect(() => {
    if (isSuccessMessages && messagesFromHook) {
      setMessages(messagesFromHook);
    }
  }, [isSuccessMessages]);

  const { addMessageAsync } = useAddMessage();
  const { deleteMessageAsync } = useDeleteMessage();

  const { playNotificationSound } = useMessageAlert();

  const messageSignalRService = useRef(messageSignalRServiceInstance);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let interval2: ReturnType<typeof setInterval>;
    let provideAlerting = false;

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        provideAlerting = true;
      }
      if (document.visibilityState === "visible") {
        if (interval) clearInterval(interval);
        if (interval2) clearInterval(interval2);
        document.title = "Chat";
        provideAlerting = false;
      }
    });

    Notification.requestPermission().then((permission) => {
      console.log("Permission status:", permission);
    });

    messageSignalRService.current.onDeleteMessage((messageId) => {
      setMessages((prev) => prev.filter((message) => message.id !== messageId));
    });

    messageSignalRService.current.onReceiveMessage((message) => {
      if (friendId) {
        setMessages((prev) => [...prev, message]);

        if (Notification.permission === "granted" && provideAlerting) {
          new Notification("Новое сообщение", {
            body: message.content,
            silent: true,
            lang: "ru",
            icon: friend?.avatar ?? "/vite.svg",
          });
        }

        playNotificationSound();

        if (document.visibilityState === "hidden") {
          document.title = "Пришло новое сообщение";
          interval = setInterval(() => {
            document.title = "Пришло новое сообщение";
          }, 2500);
          interval2 = setInterval(() => {
            document.title = "Chat";
          }, 4000);
        }
      }
    });

    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
  }, []);

  const sendMessage = async (message: string) => {
    if (friendId) {
      const formData = new FormData();
      console.log(file);
      if (file) {
        formData.append("file", file);
        formData.append("fileType", file.type);
      }
      formData.append("senderId", user?.userId ?? "");
      formData.append("reciverId", friendId);
      if (message) {
        formData.append("content", message);
      }

      await addMessageAsync(formData);
      setMessage("");
    }
  };

  const deleteMessage = async (messageId: string, forAllUsers: boolean) => {
    await deleteMessageAsync({
      messageId,
      forAllUsers,
    });
  };

  const proceedAvatar = (messageId: string) => {
    const message = messages?.find((message) => message.senderId === messageId);
    if (message) {
      return friend?.avatar;
    }
    return user?.avatar;
  };

  const proceedSenderName = (messageId: string) => {
    if (friend?.userId === messageId) {
      return friend?.name;
    }
    return user?.name;
  };

  const sendFile = (file: File) => {
    setFile(file);
  };

  return (
    <>
      <div
        ref={messagesContainerRef}
        className={styles["friend-chat__messages"]}
      >
        {messages?.map((message, id) => (
          <Message
            key={id}
            message={message}
            avatar={proceedAvatar(message.senderId)}
            senderName={proceedSenderName(message.senderId)}
            deleteMessage={deleteMessage}
            isCurrentUser={message.senderId === user?.userId}
          />
        ))}
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
