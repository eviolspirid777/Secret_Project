import type { Message as MessageType } from "@/types/Message/Message";

import styles from "./styles.module.scss";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/shadcn/ui/context-menu";

type MessageProps = {
  message: MessageType;
  avatar?: string;
};

const formatTime = (time: Date) => {
  return time.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const Message = ({ message, avatar }: MessageProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={styles["message"]}>
          <img
            className={styles["message__avatar"]}
            src={avatar}
            alt="avatar"
          />
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
