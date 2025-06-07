import type { Message as MessageType } from "@/types/Message/Message";

import styles from "./styles.module.scss";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/shadcn/ui/context-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { FileDisplay } from "@/shared/components/FileDisplay/FileDisplay";

type MessageProps = {
  message: MessageType;
  avatar?: string;
  senderName?: string;
  deleteMessage: (messageId: string, forAllUsers: boolean) => Promise<void>;
  isCurrentUser: boolean;
};

const formatTime = (time: string) => {
  return new Date(time).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const Message = ({
  message,
  avatar,
  senderName,
  deleteMessage,
  isCurrentUser,
}: MessageProps) => {
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
};
