import { useParams } from "react-router";
import { useEffect, type FC } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ChannelMessageBlock } from "./ChannelMessageBlock/ChannelMessageBlock";

import styles from "./styles.module.scss";
import { useGetChannelUsers } from "@/shared/hooks/channel/useGetChannelUsers";

export const ChannelContent: FC = () => {
  const { channelId } = useParams();

  const {
    channelUsers,
    channelUsersError,
    isChannelUsersLoading,
    isChannelUsersSuccess,
  } = useGetChannelUsers(channelId);

  useEffect(() => {}, [isChannelUsersSuccess]);

  const channel = useSelector((state: RootState) =>
    state.channels.find((ch) => ch.id === channelId)
  );

  if (!channel) {
    return <div>Канал не найден</div>;
  }

  return (
    <div className={styles["channel-content"]}>
      <div className={styles["channel-content__header"]}>
        <h2>{channel.name}</h2>
      </div>
      <div className={styles["channel-content__messages"]}>
        <ChannelMessageBlock channelId={channel.id} />
      </div>
    </div>
  );
};
