import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { getFriendById } from "@/store/slices/Friends.slice";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { FaPhone, FaVideo } from "react-icons/fa";
import { messageSignalRServiceInstance } from "@/shared/services/SignalR/Messages/MessageSignalRService";
import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";
import { addMessage, getMessages } from "@/store/slices/Message.slice";
import { Message } from "./Message/Message";
import { getUserAvatar, getUser } from "@/store/slices/User.slice";
import { useDispatch } from "react-redux";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";

export const FriendChat = () => {
  const { friendId } = useParams();
  const messageSignalRService = useRef(messageSignalRServiceInstance);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const messages = useSelector(getMessages);
  const userAvatar = useSelector(getUserAvatar);
  const friend = useSelector((state: RootState) =>
    getFriendById(state, friendId)
  );
  const user = useSelector((state: RootState) => getUser(state));

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
    return userAvatar;
  };

  const proceedSenderName = (messageId: string) => {
    if (friend?.userId === messageId) {
      return friend?.name;
    }
    return user?.name;
  };

  return (
    <div className={styles["friend-chat"]}>
      <div className={styles["friend-chat__header"]}>
        <Avatar className={styles["friend-chat__header-avatar"]}>
          <AvatarImage src={friend?.avatar} />
          <AvatarFallback>
            {friend?.name
              ?.split(" ")
              .map((name, index) => {
                if ([0, 1].includes(index)) return name[0];
              })
              .join("")}
          </AvatarFallback>
        </Avatar>
        <h1 className={styles["friend-chat__header-name"]}>{friend?.name}</h1>
        <div className={styles["friend-chat__header-actions"]}>
          <Button>
            <FaPhone />
          </Button>
          <Button>
            <FaVideo />
          </Button>
        </div>
      </div>
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
    </div>
  );
};
