import { FriendCard } from "./FriendCard/FriendCard";

import styles from "./styles.module.scss";
import { Badge } from "@/shadcn/ui/badge";
import FriendshipSignalRService from "@/shared/services/SignalR/Friendships/FriendshipSignalRService";
import { useEffect } from "react";
import { useFriendRequests } from "@/shared/hooks/user/friendship/useFriendRequests";
import { useNavigate } from "react-router";
import type { User } from "@/types/User/User";
import { UserStatusesSignalRService } from "@/shared/services/SignalR/UserStatuses/UserStatusesSignalRService";
import { useDispatch, useSelector } from "react-redux";
import { setFriendStatus } from "@/store/slices/Friends.slice";
import {
  addFriendRequest,
  getFriendsRequests,
} from "@/store/slices/FriendsRequests.slice";

type FriendsListProps = {
  friends: User[];
};

export const FriendsList = ({ friends }: FriendsListProps) => {
  const { friendRequests } = useFriendRequests();

  const friendsRequests = useSelector(getFriendsRequests);

  const dispatch = useDispatch();

  useEffect(() => {
    if (friendRequests) {
      friendRequests.forEach((request) => {
        dispatch(addFriendRequest(request.userId));
      });
    }
  }, [friendRequests]);

  useEffect(() => {
    const service = new FriendshipSignalRService();
    const userStatusesService = new UserStatusesSignalRService();

    userStatusesService.onUserStatusChange((userId, status) => {
      dispatch(setFriendStatus({ userId, status }));
    });

    service.onReceiveFriendshipRequest((friendId) => {
      dispatch(addFriendRequest(friendId));
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
        {friendsRequests.length > 0 && (
          <Badge
            variant="destructive"
            className={styles["friends-list__header-badge"]}
            onClick={handleNavigateToFriendRequests}
          >
            {friendsRequests.length}
          </Badge>
        )}
      </div>
      {friends.map((friend) => (
        <FriendCard key={friend.userId} friend={friend} />
      ))}
    </div>
  );
};
