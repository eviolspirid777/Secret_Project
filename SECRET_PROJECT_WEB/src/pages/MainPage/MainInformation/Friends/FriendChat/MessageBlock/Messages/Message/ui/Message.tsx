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
import { Loader } from "@/shared/components/Loader/loader";
import type { Message as MessageType } from "@/types/Message/Message";
import { memo, useEffect, type FC, type Ref } from "react";
import { useInView } from "react-intersection-observer";
import { MessageSendTime } from "@/shared/components/MessageSendTime/MessageSendTime";
import { useAddMessageReaction } from "@/shared/hooks/reactions/useAddMessageReaction";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { smiles } from "@/shared/smiles/smiles";
import { getMessageReactions } from "@/store/slices/Message.slice";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { AvatarBlock } from "../AvatarBlock/ui";
import { RepliedMessageContent } from "../RepliedMessageContent/ui";
import { ReactionBlock } from "@/shared/components/ReactionBlock/ui";

import styles from "./styles.module.scss";

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
      try {
        const isReactionAlreadySumbitted = reactionsAttachedToMessage?.some(
          (el) =>
            el.userId === localStorageService.getUserId() &&
            el.emotion === smile
        );
        if (isReactionAlreadySumbitted) {
          return;
        }
        await addMessageReactionAsync({
          emotion: smile,
          messageId: message.id,
          userId: localStorageService.getUserId() ?? "",
        });
      } catch (ex) {
        console.error(ex);
      }
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
                <AvatarBlock avatar={avatar} senderName={senderName} />
                <div className={styles["message__sender-content-block"]}>
                  <strong
                    className={styles["message__sender-content-block__sender"]}
                  >
                    {senderName}
                  </strong>
                  <div
                    className={styles["message__sender-content-block__content"]}
                  >
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
                        reactions={groupedReactions}
                        handleAddReaction={handleAddReaction}
                      />
                    )}
                  </div>
                </div>
                <MessageSendTime sentAt={message.sentAt} />
              </div>
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
