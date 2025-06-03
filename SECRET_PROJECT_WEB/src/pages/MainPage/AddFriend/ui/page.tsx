import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";

import styles from "./styles.module.scss";
import { useState } from "react";
import { useSendFriendRequest } from "@/shared/hooks/user/friendship/useSendFriendRequest";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { friendshipSignalRServiceInstance } from "@/shared/services/SignalR/Friendships/FriendshipSignalRService";

export const Page = () => {
  const [friendId, setFriendId] = useState("");

  const { sendFriendRequestAsync } = useSendFriendRequest();

  const handleSendFriendRequest = async () => {
    try {
      if (friendId) {
        await sendFriendRequestAsync({
          fromUserId: localStorageService.getUserId() ?? "",
          toUserId: friendId,
        });
        await friendshipSignalRServiceInstance.sendFriendshipRequest(friendId);
      } else {
        throw new Error("ID не может быть пустым");
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
        return;
      }
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
    }
  };

  return (
    <div className={styles["add-friend"]}>
      <Input
        placeholder="Введите id вашего друга"
        value={friendId}
        onChange={(e) => setFriendId(e.target.value)}
        className={styles["add-friend__input"]}
      />
      <Button onClick={handleSendFriendRequest}>Добавить друга</Button>
    </div>
  );
};
