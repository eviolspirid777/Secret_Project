import { Badge } from "@/shared/components/Badge/Badge";
import type { Friend } from "@/types/Friend/Friend";

import styles from "./styles.module.scss";

type FriendCardProps = {
  friend: Friend;
};

export const FriendCard = ({ friend }: FriendCardProps) => {
  return (
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
  );
};
