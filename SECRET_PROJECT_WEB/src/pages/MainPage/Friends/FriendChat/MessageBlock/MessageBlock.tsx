import { getUser } from "@/store/slices/User.slice";
import { useDispatch, useSelector } from "react-redux";
import { Message } from "./Message/Message";
import { getFriendById } from "@/store/slices/Friends.slice";
import type { RootState } from "@/store/store";
import { addMessage, getMessages } from "@/store/slices/Message.slice";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";

import styles from "./styles.module.scss";
import { messageSignalRServiceInstance } from "@/shared/services/SignalR/Messages/MessageSignalRService";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useMessageAlert } from "@/shared/hooks/messageAlert/useMessageAlert";

type MessageBlockProps = {
  friendId: string;
};

export const MessageBlock: FC<MessageBlockProps> = ({ friendId }) => {
  const [message, setMessage] = useState("");

  const messages = useSelector(getMessages);
  const friend = useSelector((state: RootState) =>
    getFriendById(state, friendId)
  );
  const user = useSelector((state: RootState) => getUser(state));

  const { playNotificationSound } = useMessageAlert();

  const dispatch = useDispatch();

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

    messageSignalRService.current.onReceiveMessage((message) => {
      if (friendId) {
        dispatch(
          addMessage({
            message,
            createdAt: new Date(),
            senderId: friendId,
            receiverId: friendId,
          })
        );

        if (Notification.permission === "granted" && provideAlerting) {
          new Notification("Новое сообщение", {
            body: message,
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
    if (friendId && message) {
      await messageSignalRService.current.sendMessageToUser(friendId, message);
      dispatch(
        addMessage({
          message,
          createdAt: new Date(),
          senderId: localStorageService.getUserId() ?? "",
          receiverId: friendId,
        })
      );
      setMessage("");
    }
  };

  const proceedAvatar = (messageId: string) => {
    const message = messages.find((message) => message.senderId === messageId);
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

  return (
    <>
      <div className={styles["friend-chat__messages"]}>
        {messages.map((message, id) => (
          <Message
            key={id}
            message={message}
            avatar={proceedAvatar(message.senderId)}
            senderName={proceedSenderName(message.senderId)}
          />
        ))}
      </div>
      <div className={styles["friend-chat__input-container"]}>
        <Input
          className={styles["friend-chat__input"]}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Сообщение..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage(message);
            }
          }}
        />
        <Button onClick={sendMessage.bind(null, message)}>Отправить</Button>
      </div>
    </>
  );
};
