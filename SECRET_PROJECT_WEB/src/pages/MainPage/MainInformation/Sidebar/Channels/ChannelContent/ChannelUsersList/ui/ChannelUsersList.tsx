import { Avatar } from "@/shared/components/Avatar/Avatar";
import type { User } from "@/types/User/User";
import type { FC } from "react";

import styles from "./styles.module.scss";
import { Badge } from "@/shared/components/Badge/Badge";

type ChannelUsersListProps = {
  channelUsers?: User[];
};

export const ChannelUsersList: FC<ChannelUsersListProps> = ({
  channelUsers,
}) => {
  return (
    <div className={styles["channel-user-list-block"]}>
      <h3>Участники</h3>
      <div className={styles["channel-user-list-block__items"]}>
        {channelUsers?.map((user) => (
          <div className={styles["channel-user-list-block__items__item"]}>
            <div
              className={styles["channel-user-list-block__items__item__avatar"]}
            >
              <Avatar src={user.avatar} size="small" />
              <Badge
                className={
                  styles["channel-user-list-block__items__item__avatar__badge"]
                }
                variant={user?.status ?? "Offline"}
              />
            </div>
            <span>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
