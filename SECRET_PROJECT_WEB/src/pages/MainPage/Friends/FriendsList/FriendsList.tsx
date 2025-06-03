import { FriendCard } from "./FriendCard/FriendCard";

import styles from "./styles.module.scss";
import { Badge } from "@/shadcn/ui/badge";
import { friendshipSignalRServiceInstance } from "@/shared/services/SignalR/Friendships/FriendshipSignalRService";
import { useEffect, useState } from "react";
import { useFriendRequests } from "@/shared/hooks/user/friendship/useFriendRequests";
import { useNavigate } from "react-router";
import type { User } from "@/types/User/User";

type FriendsListProps = {
  friends: User[];
};

export const FriendsList = ({ friends }: FriendsListProps) => {
  const { friendRequests } = useFriendRequests();
  const [incomingRequests, setIncomingRequests] = useState<number>(0);

  useEffect(() => {
    if (friendRequests) {
      setIncomingRequests(friendRequests.length);
    }
  }, [friendRequests]);

  useEffect(() => {
    friendshipSignalRServiceInstance.onReceiveFriendshipRequest(() => {
      console.log("HERE");
      setIncomingRequests((prev) => prev + 1);
    });
  }, []);

  const navigate = useNavigate();

  const handleNavigateToFriendRequests = () => {
    navigate("/friend-requests");
  };

  return (
    <div className={styles["friends-list"]}>
      <div className={styles["friends-list__header"]}>
        <h4 className={styles["friends-list__header-title"]}>Друзья</h4>
        {/*TODO: Не приходит почему-то sync */}
        {incomingRequests > 0 && (
          <Badge
            variant="destructive"
            className={styles["friends-list__header-badge"]}
            onClick={handleNavigateToFriendRequests}
          >
            {incomingRequests}
          </Badge>
        )}
      </div>
      {friends.map((friend) => (
        <FriendCard key={friend.userId} friend={friend} />
      ))}
    </div>
  );
};
