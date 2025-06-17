import type { FC } from "react";
import type { User } from "@/types/User/User";
import { Avatar } from "../Avatar/Avatar";

import styles from "./styles.module.scss";
import type React from "react";

type ParticipantProps = {
  user: User;
  render?: () => React.ReactNode;
  className?: string;
};

export const Participant: FC<ParticipantProps> = ({
  user,
  render,
  className,
}) => {
  return (
    <div className={styles["participant"]}>
      <Avatar src={user.avatar} className={className} />
      <div className={styles["participant__name"]}>{user.name}</div>
      {render?.()}
    </div>
  );
};
