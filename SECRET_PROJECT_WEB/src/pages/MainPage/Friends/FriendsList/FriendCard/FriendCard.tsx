import type { Friend } from "@/types/Friend/Friend";

import styles from "./styles.module.scss";

type FriendCardProps = {
  friend: Friend;
};

export const FriendCard = ({ friend }: FriendCardProps) => {
  return (
    <div className={styles["friend-card"]}>
      <img
        className={styles["friend-card__avatar"]}
        src={friend.avatar}
        alt={friend.name}
      />
      <span className={styles["friend-card__name"]}>{friend.name}</span>
      <span className={styles["friend-card__status"]}>{friend.status}</span>
    </div>
  );
};
