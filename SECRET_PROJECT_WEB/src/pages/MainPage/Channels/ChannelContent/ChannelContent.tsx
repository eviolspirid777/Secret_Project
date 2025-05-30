import { useParams } from "react-router";
import type { FC } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import styles from "./styles.module.scss";

export const ChannelContent: FC = () => {
  const { channelId } = useParams();
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
        {/* Здесь будет список сообщений */}
      </div>
    </div>
  );
};
