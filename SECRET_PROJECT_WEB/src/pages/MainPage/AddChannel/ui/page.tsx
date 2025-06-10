import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";

import styles from "./styles.module.scss";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useJoinChannel } from "@/shared/hooks/channel/user/useJoinChannel";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";

export const Page = () => {
  const [channelId, setChannelId] = useState("");

  const { joinChannelAsync, isJoinChannelPending } = useJoinChannel();

  const handleSendFriendRequest = async () => {
    try {
      if (channelId) {
        await joinChannelAsync({
          userId: localStorageService.getUserId() ?? "",
          channelId,
        });
        toast.success("Запрос отправлен");
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
    <div className={styles["add-channel"]}>
      <Input
        placeholder="Введите id канала"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
        className={styles["add-channel__input"]}
      />
      <Button onClick={handleSendFriendRequest} disabled={isJoinChannelPending}>
        Присоединиться
      </Button>
    </div>
  );
};
