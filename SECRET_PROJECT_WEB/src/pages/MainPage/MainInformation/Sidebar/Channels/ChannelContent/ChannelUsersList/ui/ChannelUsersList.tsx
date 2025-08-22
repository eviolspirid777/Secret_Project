import { Avatar } from "@/shared/components/Avatar/Avatar";
import type { User } from "@/types/User/User";
import type { FC } from "react";

type ChannelUsersListProps = {
  channelUsers?: User[];
};

export const ChannelUsersList: FC<ChannelUsersListProps> = ({
  channelUsers,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column nowrap",
      }}
    >
      {channelUsers?.map((user) => (
        <div
          style={{
            width: "100px",
          }}
        >
          <Avatar src={user.avatar} size="small" />
          <div>{user.name}</div>
        </div>
      ))}
    </div>
  );
};
