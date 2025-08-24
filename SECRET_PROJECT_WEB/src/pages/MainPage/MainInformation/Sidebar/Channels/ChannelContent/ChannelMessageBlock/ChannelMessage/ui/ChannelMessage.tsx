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
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { FileDisplay } from "@/shared/components/FileDisplay/ui/FileDisplay";
import { formatTime } from "@/shared/helpers/timeFormater/timeFormater";

import styles from "./styles.module.scss";
import { RepliedMessageContent } from "@/pages/MainPage/MainInformation/Friends/FriendChat/MessageBlock/Messages/Message/RepliedMessageContent/ui";
import { useSelector } from "react-redux";
import { getMessageReactions } from "@/store/slices/Message.slice";
import type { RootState } from "@/store/store";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useAddChannelMessageReaction } from "@/shared/hooks/reactions/useAddChannelMessageReaction";
import { smiles } from "@/shared/smiles/smiles";

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

    const reactionsAttachedToChannelMessage = useSelector((state: RootState) =>
      getMessageReactions(state, {
        messageId: message.id,
        senderId: message.senderId,
      })
    );

    const handleAddReaction = async (smile: string) => {
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
    };

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div className={styles["message-container"]}>
            <div className={styles["message"]}>
              <Avatar className={styles["message__avatar"]}>
                <AvatarImage src={avatar} />
                <AvatarFallback>
                  {senderName
                    ?.split(" ")
                    .map((name, index) => {
                      if ([0, 1].includes(index)) return name[0];
                    })
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className={styles["message__sender-content-block"]}>
                <strong
                  className={styles["message__sender-content-block__sender"]}
                >
                  {senderName}
                </strong>
                {message.content ? (
                  <div className={styles["message__content"]}>
                    <text>{message.content}</text>
                    {message.repliedMessage && (
                      <RepliedMessageContent
                        repliedMessage={message.repliedMessage}
                      />
                    )}
                    {message.reactions && (
                      <div
                        className={
                          styles[
                            "message__sender-content-block__reactions-block"
                          ]
                        }
                      >
                        {Object.keys(groupedReactions).map((el) => (
                          <div
                            key={el}
                            className={
                              styles[
                                "message__sender-content-block__reactions-block__reaction"
                              ]
                            }
                            onClick={handleAddReaction.bind(null, el)}
                          >
                            {el} {groupedReactions[el]?.length}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div />
                )}
              </div>
              <span className={styles["message__time"]}>
                {formatTime(message.sentAt)}
              </span>
            </div>
            {message.file && <FileDisplay message={message} />}
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
    );
  }
);
