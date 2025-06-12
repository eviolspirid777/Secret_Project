import type { FC } from "react";
import type { User } from "@/types/User/User";
import { Avatar } from "../Avatar/Avatar";

import styles from "./styles.module.scss";

type ParticipantProps = {
  user: User;
};

export const Participant: FC<ParticipantProps> = ({ user }) => {
  return (
    <div className={styles["participant"]}>
      <Avatar src={user.avatar} />
      <div className={styles["participant__name"]}>{user.name}</div>
    </div>
  );
};
