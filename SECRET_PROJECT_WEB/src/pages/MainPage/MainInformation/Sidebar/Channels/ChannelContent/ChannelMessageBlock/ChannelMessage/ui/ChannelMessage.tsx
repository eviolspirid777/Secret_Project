import { memo, type FC } from "react";
import type { ChannelMessage as ChannelMessageType } from "@/types/ChannelMessage/ChannelMessage";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/shadcn/ui/context-menu";
import { FileDisplay } from "@/shared/components/FileDisplay/ui/FileDisplay";
import { formatTime } from "@/shared/helpers/timeFormater/timeFormater";
import { RepliedMessageContent } from "@/pages/MainPage/MainInformation/Friends/FriendChat/MessageBlock/Messages/Message/RepliedMessageContent/ui";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useAddChannelMessageReaction } from "@/shared/hooks/reactions/useAddChannelMessageReaction";
import { smiles } from "@/shared/smiles/smiles";
import { AvatarBlock } from "../AvatarBlock/ui";
import { ReactionBlock } from "@/shared/components/ReactionBlock/ui";

import styles from "./styles.module.scss";

type ChannelMessageProps = {
  message: ChannelMessageType;
  avatar?: string;
  senderName: string;
  deleteMessage: (messageId: string, forAllUsers: boolean) => Promise<void>;
  isCurrentUser: boolean;
};

export const ChannelMessage: FC<ChannelMessageProps> = memo(
  ({ message, avatar, senderName, deleteMessage, isCurrentUser }) => {
    const { addChannelMessageReactionAsync } = useAddChannelMessageReaction();

    const groupedReactions = Object.groupBy(
      message.reactions ?? [],
      ({ emotion }) => emotion
    );

    const { reactions: reactionsAttachedToChannelMessage } = message;

    const handleAddReaction = async (smile: string) => {
      try {
        const isReactionAlreadySumbitted =
          reactionsAttachedToChannelMessage?.some(
            (el) =>
              el.userId === localStorageService.getUserId() &&
              el.emotion === smile
          );
        if (isReactionAlreadySumbitted) {
          return;
        }
        await addChannelMessageReactionAsync({
          emotion: smile,
          channelMessageId: message.id,
          userId: localStorageService.getUserId() ?? "",
        });
      } catch (ex) {
        console.error(ex);
      }
    };

    return (
      <>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className={styles["message-container"]}>
              <div className={styles["message"]}>
                <AvatarBlock avatar={avatar} senderName={senderName} />
                <div className={styles["message__sender-content-block"]}>
                  <strong
                    className={styles["message__sender-content-block__sender"]}
                  >
                    {senderName}
                  </strong>
                  <div className={styles["message__content"]}>
                    {message.file && (
                      <FileDisplay
                        message={message}
                        className={styles["file-display"]}
                      />
                    )}
                    {message.content && <text>{message.content}</text>}
                    {message.repliedMessage && (
                      <RepliedMessageContent
                        repliedMessage={message.repliedMessage}
                      />
                    )}
                    {message.reactions && (
                      <ReactionBlock
                        handleAddReaction={handleAddReaction}
                        reactions={groupedReactions}
                      />
                    )}
                  </div>
                </div>
                <span className={styles["message__time"]}>
                  {formatTime(message.sentAt)}
                </span>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Редактировать</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Ответить</ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>Отреагировать</ContextMenuSubTrigger>
              <ContextMenuPortal>
                <ContextMenuSubContent
                  className={
                    styles["message__context-menu-container__reactions-block"]
                  }
                >
                  {smiles.map((smile) => (
                    <ContextMenuItem
                      className={
                        styles[
                          "message__context-menu-container__reactions-block__reaction"
                        ]
                      }
                      onClick={handleAddReaction.bind(null, smile)}
                    >
                      {smile}
                    </ContextMenuItem>
                  ))}
                </ContextMenuSubContent>
              </ContextMenuPortal>
            </ContextMenuSub>
            {isCurrentUser ? (
              <ContextMenuSub>
                <ContextMenuSubTrigger className="context-menu-item__delete">
                  Удалить
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-44">
                  <ContextMenuItem
                    className="context-menu-item__delete"
                    onClick={deleteMessage.bind(null, message.id, false)}
                  >
                    Удалить у себя
                  </ContextMenuItem>
                  <ContextMenuItem
                    className="context-menu-item__delete"
                    onClick={deleteMessage.bind(null, message.id, true)}
                  >
                    Удалить у всех
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
            ) : (
              <ContextMenuItem
                className="context-menu-item__delete"
                onClick={deleteMessage.bind(null, message.id, false)}
              >
                Удалить
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </>
    );
  }
);
