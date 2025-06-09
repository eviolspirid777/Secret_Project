import { Channel } from "./Channel/Channel";
import type { FC } from "react";

import styles from "./styles.module.scss";
import { Profile } from "./Profile/Profile";
import { useSelector } from "react-redux";
import { getChannelsList } from "@/store/slices/Channels.slice";

export const ChannelList: FC = () => {
  const channels = useSelector(getChannelsList);

  return (
    <div className={styles["channel-list-container"]}>
      <Profile />
      {channels?.map((channel, index) => (
        <Channel key={index} channel={channel} />
      ))}
    </div>
  );
};
