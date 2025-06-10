import { Channel } from "./Channel/Channel";
import { memo, useCallback, type FC } from "react";
import { Profile } from "./Profile/Profile";
import { useSelector } from "react-redux";
import { NewChannel } from "./NewChannel/NewChannel";
import { getChannelsList } from "@/store/slices/Channels.slice";
import { useNavigate } from "react-router";

import styles from "./styles.module.scss";

export const ChannelList: FC = memo(() => {
  const channels = useSelector(getChannelsList);
  const navigate = useNavigate();

  const handleAddChannel = useCallback(() => {
    navigate("/channels/add");
  }, []);

  return (
    <div className={styles["channel-list-container"]}>
      <Profile />
      {channels?.map((channel) => (
        <Channel key={channel.id} channel={channel} />
      ))}
      <NewChannel onClick={handleAddChannel} />
    </div>
  );
});
