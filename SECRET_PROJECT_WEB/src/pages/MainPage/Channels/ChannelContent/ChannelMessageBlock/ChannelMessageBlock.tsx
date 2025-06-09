import { useEffect, useRef, useState, type FC } from "react";
import { useGetChannelMessages } from "@/shared/hooks/channelMessage/useGetChannelMessages";

import styles from "./styles.module.scss";
import type { User } from "@/types/User/User";
import { ChannelMessage } from "./ChannelMessage/ChannelMessage";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useDeleteChannelMessage } from "@/shared/hooks/channelMessage/useDeleteChannelMessage";
import { InputChannelMessageBlock } from "./InputChannelMessageBlock/InputChannelMessageBlock";
import { useAddChannelMessage } from "@/shared/hooks/channelMessage/useAddChannelMessage";
import { ChannelMessagesSignalRServiceInstance } from "@/shared/services/SignalR/ChannelMessages/ChannelMessagesSignalRService";

type ChannelMessageBlockProps = {
  channelId: string;
  channelUsers: User[];
};

export const ChannelMessageBlock: FC<ChannelMessageBlockProps> = ({
  channelId,
  channelUsers,
}) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { channelMessages } = useGetChannelMessages(channelId);

  const { deleteChannelMessageAsync } = useDeleteChannelMessage();
  const { addChannelMessageAsync } = useAddChannelMessage();

  useEffect(() => {
    ChannelMessagesSignalRServiceInstance.onReciveChannelMessage(
      (channelMessage) => {
        console.log(channelMessage);
      }
    );

    return () => {
      ChannelMessagesSignalRServiceInstance.stopReciveChannelMessage();
    };
  }, []);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const proceedAvatar = (senderId: string) => {
    const user = channelUsers.find((user) => user.userId === senderId);
    return user?.avatar;
  };

  const proceedSenderName = (senderId: string) => {
    const user = channelUsers.find((user) => user.userId === senderId);
    return user?.name ?? "";
  };

  const deleteMessage = async (messageId: string) => {
    await deleteChannelMessageAsync({ channelId, messageId });
  };

  const sendMessage = async (message: string) => {
    if (channelId) {
      const formData = new FormData();
      formData.append("senderId", localStorageService.getUserId() ?? "");
      formData.append("channelId", channelId);
      if (file) {
        formData.append("file", file);
        formData.append("fileType", file.type);
        formData.append("fileName", file.name);
      }
      if (message) {
        formData.append("content", message);
      }
      await addChannelMessageAsync(formData);
      setMessage("");
    }
  };
  const sendFile = (file: File | null) => {
    setFile(file);
  };

  return (
    <>
      <div
        ref={messagesContainerRef}
        className={styles["channel-chat__messages"]}
      >
        {channelMessages?.map((message, id) => (
          <ChannelMessage
            key={id}
            message={message}
            avatar={proceedAvatar(message.senderId)}
            senderName={proceedSenderName(message.senderId)}
            deleteMessage={deleteMessage}
            isCurrentUser={message.senderId === localStorageService.getUserId()}
          />
        ))}
      </div>
      <InputChannelMessageBlock
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        sendFile={sendFile}
      />
    </>
  );
};
