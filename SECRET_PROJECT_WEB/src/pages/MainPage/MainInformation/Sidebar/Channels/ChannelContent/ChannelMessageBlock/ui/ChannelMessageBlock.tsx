import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { useGetChannelMessages } from "@/shared/hooks/channelMessage/useGetChannelMessages";

import styles from "./styles.module.scss";
import type { User } from "@/types/User/User";
import type { ChannelMessage as ChannelMessageType } from "@/types/ChannelMessage/ChannelMessage";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useDeleteChannelMessage } from "@/shared/hooks/channelMessage/useDeleteChannelMessage";
import { useAddChannelMessage } from "@/shared/hooks/channelMessage/useAddChannelMessage";
import { ChannelMessagesSignalRServiceInstance } from "@/shared/services/SignalR/ChannelMessages/ChannelMessagesSignalRService";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "@/shared/components/Loader/loader";
import { InputChannelMessageBlock } from "../InputChannelMessageBlock/ui";
import { useMessageAlert } from "@/shared/hooks/messageAlert/useMessageAlert";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { getChannelById } from "@/store/slices/Channels.slice";
import { ChannelMessages } from "../ChannelMessages/ui";

type ChannelMessageBlockProps = {
  channelId: string;
  channelUsers: User[];
};

export const ChannelMessageBlock: FC<ChannelMessageBlockProps> = ({
  channelId,
  channelUsers,
}) => {
  const queryClient = useQueryClient();
  const channelMessagesSignalRServiceRef = useRef(
    ChannelMessagesSignalRServiceInstance
  );

  const channel = useSelector((state: RootState) =>
    getChannelById(state, { payload: channelId ?? "", type: "" })
  );

  const [message, setMessage] = useState("");
  const [repliedMessage, setRepliedMessage] = useState<ChannelMessageType>();
  const [file, setFile] = useState<File | null>(null);

  const {
    channelMessages: channelMessagesFromStore,
    isChannelMessagesLoading,
  } = useGetChannelMessages(channelId);

  const [channelMessages, setChannelMessages] = useState(
    channelMessagesFromStore
  );
  useEffect(() => {
    setChannelMessages(channelMessagesFromStore);
  }, [channelMessagesFromStore]);

  useEffect(() => {
    channelMessagesSignalRServiceRef.current.OnRecieveChannelReaction(
      (reaction) => {
        setChannelMessages((prevChannelMessages) =>
          prevChannelMessages?.map((channelMessage) => {
            const isSomeMessageExist = channelMessage.id === reaction.messageId;
            if (isSomeMessageExist) {
              return {
                ...channelMessage,
                reactions: channelMessage.reactions
                  ? [
                      ...channelMessage.reactions.filter(
                        (r) => r.userId !== reaction.userId
                      ),
                      { ...reaction },
                    ]
                  : [{ ...reaction }],
              };
            }
            return channelMessage;
          })
        );
      }
    );

    return () => {
      channelMessagesSignalRServiceRef.current.StopRecieveChannelReaction();
    };
  }, []);

  const { playNotificationSound } = useMessageAlert();

  const { deleteChannelMessageAsync } = useDeleteChannelMessage();
  const { addChannelMessageAsync } = useAddChannelMessage();

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

    ChannelMessagesSignalRServiceInstance.onReciveChannelMessage(
      (channelMessage) => {
        queryClient.setQueryData(
          ["channel-messages", channelMessage.channelId],
          (oldData: ChannelMessageType[]) => {
            return [...oldData, channelMessage];
          }
        );

        if (Notification.permission === "granted" && provideAlerting) {
          new Notification(`Сообщение из "${channel.name}"`, {
            body: channelMessage.content
              ? `${channelMessage.senderId}: ${channelMessage.content}`
              : `Файл: ${channelMessage.file?.fileName}`,
            silent: true,
            lang: "ru",
            icon: "/vite.svg",
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
    );

    ChannelMessagesSignalRServiceInstance.OnReciveAudioRoomCreated((room) => {
      console.log("roomId", room);
    });

    ChannelMessagesSignalRServiceInstance.OnReciveAudioRoomDeleted((roomId) => {
      console.log("roomId", roomId);
    });

    return () => {
      clearInterval(interval);
      clearInterval(interval2);
      ChannelMessagesSignalRServiceInstance.StopReciveChannelMessage();
      ChannelMessagesSignalRServiceInstance.StopReciveAudioRoomCreated();
      ChannelMessagesSignalRServiceInstance.StopReciveAudioRoomDeleted();
    };
  }, [queryClient, channelId]);

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
    if (channelId && (message || fileLocal)) {
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
      if (repliedMessage) {
        formData.append("repliedMessageId", repliedMessage.id);
      }
      await addChannelMessageAsync(formData);
      setMessage("");
      setRepliedMessage(undefined);
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
      <ChannelMessages
        channelMessages={channelMessages}
        messagesContainerRef={messagesContainerRef}
        deleteMessage={deleteMessage}
        proceedAvatar={proceedAvatar}
        proceedSenderName={proceedSenderName}
        setRepliedMessage={setRepliedMessage}
      />
      <InputChannelMessageBlock
        message={message}
        repliedMessage={repliedMessage}
        setMessage={setMessage}
        sendMessage={sendMessage}
        sendFile={sendFile}
      />
    </>
  );
};
