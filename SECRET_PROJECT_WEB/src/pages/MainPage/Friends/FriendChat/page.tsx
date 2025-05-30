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
import { getUserAvatar } from "@/store/slices/User.slice";
import { useDispatch } from "react-redux";

export const FriendChat = () => {
  const { friendId } = useParams();
  const messageSignalRService = useRef(messageSignalRServiceInstance);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const messages = useSelector(getMessages);
  const userAvatar = useSelector(getUserAvatar);
  const friend = useSelector((state: RootState) =>
    getFriendById(state, friendId)
  );

  useEffect(() => {
    messageSignalRService.current.onReceiveMessage((message) => {
      if (friendId) {
        dispatch(
          addMessage({ message, createdAt: new Date(), senderId: friendId })
        );
      }
    });
  }, []);

  const sendMessage = async (message: string) => {
    if (friendId) {
      await messageSignalRService.current.sendMessageToUser(
        "a5b99e1a-719e-4d22-8101-977eb95a9e04",
        message
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

  return (
    <div className={styles["friend-chat"]}>
      <div className={styles["friend-chat__header"]}>
        <img
          className={styles["friend-chat__header-avatar"]}
          src={friend?.avatar}
          alt={friend?.name}
        />
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
          />
        ))}
      </div>
      <div className={styles["friend-chat__input-container"]}>
        <Input
          className={styles["friend-chat__input"]}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Сообщение..."
        />
        <Button onClick={sendMessage.bind(null, message)}>Отправить</Button>
      </div>
    </div>
  );
};
