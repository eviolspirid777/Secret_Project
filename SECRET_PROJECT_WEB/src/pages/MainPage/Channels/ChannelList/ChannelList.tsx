import { Channel } from "./Channel/Channel";
import type { FC } from "react";

import styles from "./styles.module.scss";
import { Profile } from "./Profile/Profile";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export const ChannelList: FC = () => {
  const channels = useSelector((state: RootState) => state.channels);

  return (
    <div className={styles["channel-list-container"]}>
      <Profile />
      {channels?.map((channel, index) => (
        <Channel key={index} channel={channel} />
      ))}
    </div>
  );
};
