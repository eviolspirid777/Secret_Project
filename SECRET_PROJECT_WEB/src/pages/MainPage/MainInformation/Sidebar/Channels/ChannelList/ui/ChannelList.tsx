import { Channel } from "../Channel/ui";
import { memo, type FC } from "react";
import { Profile } from "../Profile/ui";
import { useSelector } from "react-redux";
import { NewChannel } from "../NewChannel/ui";
import { getChannelsList } from "@/store/slices/Channels.slice";

import styles from "./styles.module.scss";

export const ChannelList: FC = memo(() => {
  const channels = useSelector(getChannelsList);

  return (
    <div className={styles["channel-list-container"]}>
      <Profile />
      {channels?.map((channel) => (
        <Channel key={channel.id} channel={channel} />
      ))}
      <NewChannel />
    </div>
  );
});
