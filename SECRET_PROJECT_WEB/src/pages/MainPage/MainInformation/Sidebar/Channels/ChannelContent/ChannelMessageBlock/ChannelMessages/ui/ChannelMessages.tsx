import { isNextDay } from "@/shared/helpers/timeFormater/isNextDay";
import type { ChannelMessage as ChannelMessageType } from "@/types/ChannelMessage/ChannelMessage";
import dayjs from "dayjs";
import type { FC } from "react";

import styles from "./styles.module.scss";
import { ChannelMessage } from "../ChannelMessage/ui";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";

type ChannelMessagesProps = {
  channelMessages?: ChannelMessageType[];
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  proceedAvatar: (senderId: string) => string | undefined;
  proceedSenderName: (senderId: string) => string;
  deleteMessage: (messageId: string) => Promise<void>;
  setRepliedMessage: React.Dispatch<
    React.SetStateAction<ChannelMessageType | undefined>
  >;
};

export const ChannelMessages: FC<ChannelMessagesProps> = ({
  messagesContainerRef,
  channelMessages,
  deleteMessage,
  proceedSenderName,
  proceedAvatar,
  setRepliedMessage,
}) => {
  return (
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
            isCurrentUser={message.senderId === localStorageService.getUserId()}
            setRepliedMessage={setRepliedMessage}
          />
        </>
      ))}
    </div>
  );
};
