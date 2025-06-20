import { memo, type FC } from "react";
import type { ChannelMessage as ChannelMessageType } from "@/types/ChannelMessage/ChannelMessage";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/shadcn/ui/context-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { FileDisplay } from "@/shared/components/FileDisplay/FileDisplay";
import { formatTime } from "@/shared/helpers/timeFormater/timeFormater";

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
              {message.content ? (
                <div className={styles["message__content"]}>
                  {message.content}
                </div>
              ) : (
                <div />
              )}
              <span className={styles["message__time"]}>
                {formatTime(message.sentAt)}
              </span>
            </div>
            {message.file && <FileDisplay message={message} />}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Ответить</ContextMenuItem>
          <ContextMenuItem>Переслать</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Редактировать</ContextMenuItem>
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
