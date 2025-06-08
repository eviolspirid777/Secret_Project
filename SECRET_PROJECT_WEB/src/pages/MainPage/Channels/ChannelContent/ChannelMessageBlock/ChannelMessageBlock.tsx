import { InputBlock } from "@/pages/MainPage/Friends/FriendChat/MessageBlock/InputBlock/InputBlock";
import { Message } from "@/pages/MainPage/Friends/FriendChat/MessageBlock/Message/Message";
import { useRef, type FC } from "react";
import { useGetChannelMessages } from "@/shared/hooks/channelMessage/useGetChannelMessages";

import styles from "./styles.module.scss";

type ChannelMessageBlockProps = {
  channelId: string;
};

export const ChannelMessageBlock: FC<ChannelMessageBlockProps> = ({
  channelId,
}) => {
  const { channelMessages, isChannelMessagesLoading, channelMessagesError } =
    useGetChannelMessages(channelId);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={messagesContainerRef}
        className={styles["channel-chat__messages"]}
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
