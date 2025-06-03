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

type FriendCardProps = {
  friend: User;
};

export const FriendCard = ({ friend }: FriendCardProps) => {
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
