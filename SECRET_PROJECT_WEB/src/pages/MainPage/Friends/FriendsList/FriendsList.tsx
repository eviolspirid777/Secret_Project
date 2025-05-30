import type { Friend } from "@/types/Friend/Friend";
import { FriendCard } from "./FriendCard/FriendCard";

import styles from "./styles.module.scss";

type FriendsListProps = {
  friends: Friend[];
};

export const FriendsList = ({ friends }: FriendsListProps) => {
  return (
    <div className={styles["friends-list"]}>
      <h4 className={styles["friends-list__title"]}>Друзья</h4>
      {friends.map((friend) => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
};
