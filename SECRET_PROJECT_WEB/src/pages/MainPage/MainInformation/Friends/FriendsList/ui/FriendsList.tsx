import { FriendCard } from "../FriendCard/ui";

import styles from "./styles.module.scss";
import { Badge } from "@/shadcn/ui/badge";
import { friendshipSignalRServiceInstance } from "@/shared/services/SignalR/Friendships/FriendshipSignalRService";
import { useEffect, useRef } from "react";
import { useFriendRequests } from "@/shared/hooks/user/friendship/useFriendRequests";
import { useNavigate } from "react-router";
import type { User } from "@/types/User/User";
import { userStatusesSignalRServiceInstance } from "@/shared/services/SignalR/UserStatuses/UserStatusesSignalRService";
import { useDispatch, useSelector } from "react-redux";
import { setFriendStatus } from "@/store/slices/Friends.slice";
import {
  addFriendRequest,
  getFriendsRequests,
  removeFriendRequest,
} from "@/store/slices/FriendsRequests.slice";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useQueryClient } from "@tanstack/react-query";

type FriendsListProps = {
  friends: User[];
};

export const FriendsList = ({ friends }: FriendsListProps) => {
  const { friendRequests, fetchFriendsRequests } = useFriendRequests();
  useEffect(() => {
    fetchFriendsRequests();
  }, []);

  const queryClient = useQueryClient();

  const friendRequestsFromStore = useSelector(getFriendsRequests);

  const dispatch = useDispatch();

  const userStatusesSignalRService = useRef(userStatusesSignalRServiceInstance);
  const friendshipSignalRService = useRef(friendshipSignalRServiceInstance);

  useEffect(() => {
    if (friendRequests) {
      friendRequests.forEach((request) => {
        const noMatching = !friendRequestsFromStore.some(
          (fr) => request.userId === fr
        );
        if (noMatching) {
          dispatch(addFriendRequest(request.userId));
        }
      });
    }
  }, [friendRequests, dispatch]);

  useEffect(() => {
    userStatusesSignalRService.current.onUserStatusChange((userId, status) => {
      dispatch(setFriendStatus({ userId, status }));
    });

    friendshipSignalRService.current.onReceiveFriendshipRequest((friendId) => {
      const noMatches = !friendRequests?.some((fr) => fr.userId === friendId);
      if (noMatches) {
        dispatch(addFriendRequest(friendId));
      }
    });

    friendshipSignalRService.current.onReceiveFriendStatusChange(
      async (data) => {
        const currentUserId = localStorageService.getUserId();
        dispatch(
          removeFriendRequest(
            currentUserId === data.userId ? data.friendId : data.userId
          )
        );
        await queryClient.invalidateQueries({
          queryKey: ["user-friends", currentUserId ?? ""],
        });
      }
    );

    return () => {
      userStatusesSignalRService.current.stopOnUserStatusChange();
      friendshipSignalRService.current.stopOnReceiveFriendshipRequest();
      friendshipSignalRService.current.stopReceiveFriendStatusChange();
    };
  }, [dispatch]);

  const navigate = useNavigate();

  const handleNavigateToFriendRequests = () => {
    navigate("/friend-requests");
  };

  return (
    <div className={styles["friends-list"]}>
      <div className={styles["friends-list__header"]}>
        <h4 className={styles["friends-list__header-title"]}>Друзья</h4>
        {/*TODO: Не приходит почему-то sync */}
        {friendRequestsFromStore.length > 0 && (
          <Badge
            variant="destructive"
            className={styles["friends-list__header-badge"]}
            onClick={handleNavigateToFriendRequests}
          >
            {friendRequestsFromStore.length}
          </Badge>
        )}
      </div>
      {friends.map((friend) => (
        <FriendCard key={friend.userId} friend={friend} />
      ))}
    </div>
  );
};
