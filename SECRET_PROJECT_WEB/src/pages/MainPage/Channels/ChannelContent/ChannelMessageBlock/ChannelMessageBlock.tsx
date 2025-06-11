import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { useGetChannelMessages } from "@/shared/hooks/channelMessage/useGetChannelMessages";

import styles from "./styles.module.scss";
import type { User } from "@/types/User/User";
import type { ChannelMessage as ChannelMessageType } from "@/types/ChannelMessage/ChannelMessage";
import { ChannelMessage } from "./ChannelMessage/ChannelMessage";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useDeleteChannelMessage } from "@/shared/hooks/channelMessage/useDeleteChannelMessage";
import { InputChannelMessageBlock } from "./InputChannelMessageBlock/InputChannelMessageBlock";
import { useAddChannelMessage } from "@/shared/hooks/channelMessage/useAddChannelMessage";
import { ChannelMessagesSignalRServiceInstance } from "@/shared/services/SignalR/ChannelMessages/ChannelMessagesSignalRService";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "@/shared/components/Loader/loader";

type ChannelMessageBlockProps = {
  channelId: string;
  channelUsers: User[];
};

export const ChannelMessageBlock: FC<ChannelMessageBlockProps> = ({
  channelId,
  channelUsers,
}) => {
  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { channelMessages, isChannelMessagesLoading } =
    useGetChannelMessages(channelId);

  const { deleteChannelMessageAsync } = useDeleteChannelMessage();
  const { addChannelMessageAsync } = useAddChannelMessage();

  useEffect(() => {
    ChannelMessagesSignalRServiceInstance.onReciveChannelMessage(
      (channelMessage) => {
        queryClient.setQueryData(
          ["channel-messages", channelId],
          (oldData: ChannelMessageType[]) => {
            return [...oldData, channelMessage];
          }
        );
      }
    );

    ChannelMessagesSignalRServiceInstance.OnReciveAudioRoomCreated((room) => {
      console.log("roomId", room);
    });

    ChannelMessagesSignalRServiceInstance.OnReciveAudioRoomDeleted((roomId) => {
      console.log("roomId", roomId);
    });

    return () => {
      ChannelMessagesSignalRServiceInstance.StopReciveChannelMessage();
      ChannelMessagesSignalRServiceInstance.StopReciveAudioRoomCreated();
      ChannelMessagesSignalRServiceInstance.StopReciveAudioRoomDeleted();
    };
  }, []);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const proceedAvatar = useCallback(
    (senderId: string) => {
      const user = channelUsers.find((user) => user.userId === senderId);
      return user?.avatar;
    },
    [channelUsers]
  );

  const proceedSenderName = useCallback(
    (senderId: string) => {
      const user = channelUsers.find((user) => user.userId === senderId);
      return user?.name ?? "";
    },
    [channelUsers]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      await deleteChannelMessageAsync({ channelId, messageId });
    },
    [channelId]
  );

  const sendMessage = async (message: string | null, fileLocal?: File) => {
    if (channelId && (message || file)) {
      const formData = new FormData();
      formData.append("senderId", localStorageService.getUserId() ?? "");
      formData.append("channelId", channelId);
      if (fileLocal || file) {
        formData.append("file", fileLocal ?? file!);
        formData.append("fileType", fileLocal?.type ?? file!.type);
        formData.append("fileName", fileLocal?.name ?? file!.name);
      }
      if (message) {
        formData.append("content", message);
      }
      await addChannelMessageAsync(formData);
      setMessage("");
    }
  };

  const sendFile = useCallback((file: File | null) => {
    setFile(file);
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [channelMessages]);

  if (isChannelMessagesLoading) {
    return <Loader height="screen" className={styles["loader"]} />;
  }

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
