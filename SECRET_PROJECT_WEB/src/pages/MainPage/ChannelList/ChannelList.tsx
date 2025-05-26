import { Channel } from "./Channel/Channel";
import type { Channel as ChannelType } from "@/types/Channel/Channel";
import type { FC } from "react";

import styles from "./styles.module.scss";
import { Profile } from "./Profile/Profile";

type ChannelListProps = {
  channels?: ChannelType[];
};

export const ChannelList: FC<ChannelListProps> = ({ channels }) => {
  return (
    <div className={styles["channel-list-container"]}>
      <Profile />
      {channels?.map((channel, index) => (
        <Channel key={index} channel={channel} />
      ))}
    </div>
  );
};
