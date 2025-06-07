import { Badge } from "@/shared/components/Badge/Badge";

import styles from "./styles.module.scss";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/shadcn/ui/context-menu";
import { useNavigate } from "react-router";
import type { User } from "@/types/User/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { useSelector } from "react-redux";
import { getUnreadedMessagesUsersId } from "@/store/slices/UnreadedMessagesUsersId.slice";
import type { RootState } from "@/store/store";

type FriendCardProps = {
  friend: User;
};

export const FriendCard = ({ friend }: FriendCardProps) => {
  const unreadedMessagesUsersId = useSelector((state: RootState) =>
    getUnreadedMessagesUsersId(state)
  );

  const navigate = useNavigate();

  const handleFriendClick = () => {
    navigate(`/friend-chat/${friend.userId}`);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={styles["friend-card"]} onClick={handleFriendClick}>
          <div className={styles["friend-card__avatar-wrapper"]}>
            <Avatar>
              <AvatarImage src={friend.avatar} />
              <AvatarFallback>
                {friend.name
                  ?.split(" ")
                  .map((name, index) => {
                    if ([0, 1].includes(index)) return name[0];
                  })
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Badge
              className={styles["friend-card__badge"]}
              variant={friend.status}
            />
          </div>
          <div className={styles["friend-card__name-wrapper"]}>
            <span className={styles["friend-card__name"]}>{friend.name}</span>
            {unreadedMessagesUsersId.includes(friend.userId) && (
              <Badge
                className={styles["friend-card__unreaded-messages-badge"]}
                variant="destructive"
              />
            )}
          </div>
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
