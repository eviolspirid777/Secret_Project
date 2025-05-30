import { Badge } from "@/shared/components/Badge/Badge";
import type { Friend } from "@/types/Friend/Friend";

import styles from "./styles.module.scss";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/shadcn/ui/context-menu";

type FriendCardProps = {
  friend: Friend;
};

export const FriendCard = ({ friend }: FriendCardProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={styles["friend-card"]}>
          <div className={styles["friend-card__avatar-wrapper"]}>
            <img
              className={styles["friend-card__avatar"]}
              src={friend.avatar}
              alt={friend.name}
            />
            <Badge
              className={styles["friend-card__badge"]}
              variant={friend.status}
            />
          </div>
          <span className={styles["friend-card__name"]}>{friend.name}</span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Позвонить</ContextMenuItem>
        <ContextMenuItem>Отправить сообщение</ContextMenuItem>
        <ContextMenuItem>Выключить уведомления</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Посмотреть профиль</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="context-menu-item__delete">
          Удалить из друзей
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
