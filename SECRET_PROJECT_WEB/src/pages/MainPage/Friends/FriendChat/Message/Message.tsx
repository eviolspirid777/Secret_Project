import type { Message as MessageType } from "@/types/Message/Message";

import styles from "./styles.module.scss";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/shadcn/ui/context-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";

type MessageProps = {
  message: MessageType;
  avatar?: string;
  senderName?: string;
};

const formatTime = (time: Date) => {
  return time.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const Message = ({ message, avatar, senderName }: MessageProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
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
          <div className={styles["message__content"]}>{message.message}</div>
          <span className={styles["message__time"]}>
            {formatTime(message.createdAt)}
          </span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Ответить</ContextMenuItem>
        <ContextMenuItem>Переслать</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Редактировать</ContextMenuItem>
        <ContextMenuItem className="context-menu-item__delete">
          Удалить
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
