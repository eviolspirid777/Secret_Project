import type { Message as MessageType } from "@/types/Message/Message";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuPortal,
} from "@/shadcn/ui/context-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { FileDisplay } from "@/shared/components/FileDisplay/ui/FileDisplay";
import { memo, useEffect, type FC, type Ref } from "react";
import { Loader } from "@/shared/components/Loader/loader";
import { useInView } from "react-intersection-observer";

import styles from "./styles.module.scss";
import { MessageSendTime } from "@/shared/components/MessageSendTime/MessageSendTime";
import { RepliedMessageContent } from "../RepliedMessageContent/ui";
import { useAddMessageReaction } from "@/shared/hooks/reactions/useAddMessageReaction";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useSelector } from "react-redux";
import { getMessageReactions } from "@/store/slices/Message.slice";
import type { RootState } from "@/store/store";
import { smiles } from "@/shared/smiles/smiles";

type MessageProps = {
  ref?: (node?: Element | null) => void;
  firstLastMessageRef?: Ref<HTMLDivElement> | undefined;
  friendId: string;
  message: MessageType;
  avatar?: string;
  senderName?: string;
  deleteMessage: (messageId: string, forAllUsers: boolean) => Promise<void>;
  deleteFromNewMessages?: (messageId: string) => void;
  setRepliedMessage?: (repliedMessage: MessageType) => void;
  isCurrentUser: boolean;
  isLoadingNextMessages: boolean;
};

export const Message: FC<MessageProps> = memo(
  ({
    message,
    avatar,
    senderName,
    deleteMessage,
    isCurrentUser,
    ref,
    friendId,
    firstLastMessageRef,
    deleteFromNewMessages,
    setRepliedMessage,
    isLoadingNextMessages,
  }) => {
    const { ref: messageInViewRef, inView: messageInView } = useInView({
      delay: 1000,
    });

    const reactionsAttachedToMessage = useSelector((state: RootState) =>
      getMessageReactions(state, {
        messageId: message.id,
        senderId: friendId,
      })
    );

    const { addMessageReactionAsync } = useAddMessageReaction();

    const handleAddReaction = async (smile: string) => {
      const isReactionAlreadySumbitted = reactionsAttachedToMessage?.some(
        (el) =>
          el.userId === localStorageService.getUserId() && el.emotion === smile
      );
      if (isReactionAlreadySumbitted) {
        return;
      }
      await addMessageReactionAsync({
        emotion: smile,
        messageId: message.id,
        userId: localStorageService.getUserId() ?? "",
      });
    };

    //TODO: В отдельную компоненту вынеси Реакции, чтобы не срабатывал метод группировки ко всем сообщениям,
    // на беке добавь синки для того, чтобы отправлять реакции к сообщениям другим пользователям

    const groupedReactions = Object.groupBy(
      message.reactions ?? [],
      ({ emotion }) => emotion
    );

    useEffect(() => {
      if (messageInView) {
        deleteFromNewMessages?.(message.id);
      }
    }, [messageInView]);

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <>
            {ref !== undefined && isLoadingNextMessages && (
              <div className={styles["next-message-loader-block"]}>
                <Loader
                  height="screen"
                  className={styles["next-message-loader-block__loader"]}
                />
              </div>
            )}
            {firstLastMessageRef && (
              <div
                ref={ref ?? firstLastMessageRef}
                className={styles["message-container__new-messages"]}
              >
                Новые сообщения
              </div>
            )}
            <div id={message.id} className={styles["message-container"]}>
              <div className={styles["message"]} ref={ref ?? messageInViewRef}>
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
                    <div
                      className={
                        styles["message__sender-content-block__content"]
                      }
                    >
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
                <MessageSendTime sentAt={message.sentAt} />
              </div>
              {message.file && <FileDisplay message={message} />}
            </div>
          </>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Редактировать</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={setRepliedMessage?.bind(null, message)}>
            Ответить
          </ContextMenuItem>
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
