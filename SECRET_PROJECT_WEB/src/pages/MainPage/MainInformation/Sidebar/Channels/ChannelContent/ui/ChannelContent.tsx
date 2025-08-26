import { useParams } from "react-router";
import { useEffect, useState, type FC } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ChannelMessageBlock } from "../ChannelMessageBlock/ui";

import styles from "./styles.module.scss";
import { useGetChannelUsers } from "@/shared/hooks/channel/user/useGetChannelUsers";
import { getChannelById } from "@/store/slices/Channels.slice";
import type { User } from "@/types/User/User";
import { Loader } from "@/shared/components/Loader/loader";
import { ChannelUsersList } from "../ChannelUsersList/ui";
import { FaUserFriends } from "react-icons/fa";

export const ChannelContent: FC = () => {
  const { channelId } = useParams();
  const [channelUsers, setChannelUsers] = useState<User[]>([]);
  const [channelUserListAvailable, setChannelUserListAvailable] =
    useState(false);

  //TODO: реализовать смену статуса у пользователя в списке участников канала
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
    <div className={styles["channel-block"]}>
      <div className={styles["channel-content"]}>
        <div className={styles["channel-content__header"]}>
          <h2>{channel.name}</h2>
          <FaUserFriends
            className={`${styles["channel-content__header__friends-icon"]} ${
              channelUserListAvailable && styles["active"]
            }`}
            size={23}
            onClick={setChannelUserListAvailable.bind(null, (prev) => !prev)}
          />
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
      {channelUserListAvailable && (
        <ChannelUsersList channelUsers={channelUsers} />
      )}
    </div>
  );
};
