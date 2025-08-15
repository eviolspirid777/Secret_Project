import { useParams } from "react-router";
import { useEffect, useState, type FC } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ChannelMessageBlock } from "./ChannelMessageBlock/ChannelMessageBlock";

import styles from "./styles.module.scss";
import { useGetChannelUsers } from "@/shared/hooks/channel/user/useGetChannelUsers";
import { getChannelById } from "@/store/slices/Channels.slice";
import type { User } from "@/types/User/User";
import { Loader } from "@/shared/components/Loader/loader";

export const ChannelContent: FC = () => {
  const { channelId } = useParams();
  const [channelUsers, setChannelUsers] = useState<User[]>([]);

  const {
    channelUsers: channelUsersResponse,
    isChannelUsersSuccess,
    isChannelUsersLoading,
  } = useGetChannelUsers(channelId);

  useEffect(() => {
    if (channelUsersResponse) {
      setChannelUsers(channelUsersResponse);
    }
  }, [isChannelUsersSuccess]);

  const channel = useSelector((state: RootState) =>
    getChannelById(state, { payload: channelId ?? "", type: "" })
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
        {isChannelUsersLoading ? (
          <Loader height="screen" className={styles["loader"]} />
        ) : (
          <ChannelMessageBlock
            channelId={channel.id}
            channelUsers={channelUsers}
          />
        )}
      </div>
    </div>
  );
};
