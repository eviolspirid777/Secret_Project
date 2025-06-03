import { Avatar } from "@/shared/components/Avatar/Avatar";
import styles from "./styles.module.scss";
import { Button } from "@/shadcn/ui/button";
import { useAcceptFriendRequest } from "@/shared/hooks/user/friendship/useAcceptFriendRequest";
import { useDeclineFriendRequest } from "@/shared/hooks/user/friendship/useDeclineFriendRequest";
import { useFriendRequests } from "@/shared/hooks/user/friendship/useFriendRequests";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useEffect, useState } from "react";
import type { User } from "@/types/User/User";

export const Page = () => {
  const { friendRequests } = useFriendRequests();
  const [friends, setFriends] = useState<User[]>();

  useEffect(() => {
    if (friendRequests) {
      setFriends(friendRequests);
    }
  }, [friendRequests]);

  const { acceptFriendRequestAsync } = useAcceptFriendRequest();
  const { declineFriendRequestAsync } = useDeclineFriendRequest();

  const handleAcceptFriendRequest = async (friendId: string) => {
    try {
      await acceptFriendRequestAsync({
        fromUserId: localStorageService.getUserId() ?? "",
        toUserId: friendId,
      });
      setFriends(friends?.filter((friend) => friend.userId !== friendId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeclineFriendRequest = async (friendId: string) => {
    try {
      await declineFriendRequestAsync({
        fromUserId: localStorageService.getUserId() ?? "",
        toUserId: friendId,
      });
      setFriends(friends?.filter((friend) => friend.userId !== friendId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles["friend-requests"]}>
      <h1 className={styles["friend-requests__title"]}>Запросы в друзья</h1>
      <ul className={styles["friend-requests__list"]}>
        {friends?.map((friendRequest) => (
          <li className={styles["friend-requests__item"]}>
            <div className={styles["friend-requests__item-content"]}>
              <Avatar src={friendRequest.avatar} size="small" />
              <div className={styles["friend-requests__item-info"]}>
                <h3 className={styles["friend-requests__item-info-name"]}>
                  {friendRequest.name}
                </h3>
              </div>
              <div className={styles["friend-requests__item-actions"]}>
                <Button
                  variant="outline"
                  onClick={handleAcceptFriendRequest.bind(
                    null,
                    friendRequest.userId
                  )}
                >
                  Принять
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDeclineFriendRequest.bind(
                    null,
                    friendRequest.userId
                  )}
                >
                  Отклонить
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
