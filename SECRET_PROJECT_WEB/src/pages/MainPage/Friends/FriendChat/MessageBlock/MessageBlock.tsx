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

  const dispatch = useDispatch();

  const messageSignalRService = useRef(messageSignalRServiceInstance);

  useEffect(() => {
    messageSignalRService.current.onReceiveMessage((message) => {
      console.log(message);
      if (friendId) {
        dispatch(
          addMessage({
            message,
            createdAt: new Date(),
            senderId: friendId,
            receiverId: friendId,
          })
        );
      }
    });
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
