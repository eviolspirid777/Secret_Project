import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";

import styles from "./styles.module.scss";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAddChannel } from "@/shared/hooks/channel/useAddChannel";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const Adding = () => {
  const [channelName, setChannelName] = useState("");

  const queryClient = useQueryClient();

  const { addChannelAsync, isAddChannelPending } = useAddChannel();

  const handleCreateChannel = async () => {
    try {
      if (channelName) {
        await addChannelAsync({
          name: channelName,
          //TODO: реализовать логику добавления автарки
          channelAvatarUrl: "",
          adminId: localStorageService.getUserId() ?? "",
        });
        toast.success("Канал создан");
        setChannelName("");
        queryClient.invalidateQueries({ queryKey: ["channels"] });
      }
    } catch (ex) {
      if (ex instanceof AxiosError) {
        toast.error(ex.response?.data);
        return;
      }
      if (ex instanceof Error) {
        toast.error(ex.message);
        return;
      }
    }
  };

  return (
    <div className={styles["create-channel"]}>
      <Input
        placeholder="Введите название канала"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        className={styles["create-channel__input"]}
      />
      <Button
        className={styles["create-channel__button"]}
        onClick={handleCreateChannel}
        disabled={isAddChannelPending}
      >
        Создать канал
      </Button>
    </div>
  );
};
