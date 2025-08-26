import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { useGetChannelMessages } from "@/shared/hooks/channelMessage/useGetChannelMessages";

import styles from "./styles.module.scss";
import type { User } from "@/types/User/User";
import type { ChannelMessage as ChannelMessageType } from "@/types/ChannelMessage/ChannelMessage";
import { ChannelMessage } from "../ChannelMessage/ui";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useDeleteChannelMessage } from "@/shared/hooks/channelMessage/useDeleteChannelMessage";
import { useAddChannelMessage } from "@/shared/hooks/channelMessage/useAddChannelMessage";
import { ChannelMessagesSignalRServiceInstance } from "@/shared/services/SignalR/ChannelMessages/ChannelMessagesSignalRService";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "@/shared/components/Loader/loader";
import { isNextDay } from "@/shared/helpers/timeFormater/isNextDay";
import dayjs from "dayjs";
import { InputChannelMessageBlock } from "../InputChannelMessageBlock/ui";
import { useMessageAlert } from "@/shared/hooks/messageAlert/useMessageAlert";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { getChannelById } from "@/store/slices/Channels.slice";

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
    //TODO: Решить вопрос с реакцией
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
          ["channel-messages", channelId],
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
        {channelMessages?.map((message, id, messages) => (
          <>
            {((messages[id - 1] &&
              isNextDay(message.sentAt, messages[id - 1]?.sentAt)) ||
              messages[id - 1] === undefined) && (
              <div className={styles["channel-chat__messages__date"]}>
                {dayjs(message.sentAt).format("DD.MM")}
              </div>
            )}
            <ChannelMessage
              key={id}
              message={message}
              avatar={proceedAvatar(message.senderId)}
              senderName={proceedSenderName(message.senderId)}
              deleteMessage={deleteMessage}
              isCurrentUser={
                message.senderId === localStorageService.getUserId()
              }
            />
          </>
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
