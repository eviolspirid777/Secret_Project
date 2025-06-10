import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useJoinChannel } from "@/shared/hooks/channel/user/useJoinChannel";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { Adding } from "../Adding/Adding";
import { Joining } from "../Joining/Joining";

import styles from "./styles.module.scss";
import { useAddChannel } from "@/shared/hooks/channel/useAddChannel";
import { useQueryClient } from "@tanstack/react-query";

export const Page = () => {
  const [channelId, setChannelId] = useState("");
  const [channelName, setChannelName] = useState("");

  const queryClient = useQueryClient();

  const { joinChannelAsync, isJoinChannelPending } = useJoinChannel();
  const { addChannelAsync, isAddChannelPending } = useAddChannel();

  const handleSendFriendRequest = async () => {
    try {
      if (channelId) {
        await joinChannelAsync({
          userId: localStorageService.getUserId() ?? "",
          channelId,
        });
        toast.success("Запрос отправлен");
        setChannelId("");
        queryClient.invalidateQueries({ queryKey: ["channels"] });
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
    <div className={styles["add-channel-page"]}>
      <Joining
        channelId={channelId}
        setChannelId={setChannelId}
        handleSendFriendRequest={handleSendFriendRequest}
        isJoinChannelPending={isJoinChannelPending}
      />
      <hr className={styles["separator"]} />
      <Adding
        channelName={channelName}
        setChannelName={setChannelName}
        createChannel={handleCreateChannel}
        isAddChannelPending={isAddChannelPending}
      />
    </div>
  );
};
