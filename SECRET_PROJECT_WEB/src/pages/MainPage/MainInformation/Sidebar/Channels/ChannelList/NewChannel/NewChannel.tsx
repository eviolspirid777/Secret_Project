import { Avatar, AvatarFallback } from "@/shadcn/ui/avatar";
import { useCallback, type FC, type MouseEventHandler } from "react";
import { useNavigate } from "react-router";

import styles from "./styles.module.scss";

type NewChannelProps = {
  onClick?: MouseEventHandler<HTMLSpanElement>;
};

export const NewChannel: FC<NewChannelProps> = () => {
  const navigate = useNavigate();

  const handleAddChannel = useCallback(() => {
    navigate("/channels/add");
  }, []);

  return (
    <Avatar
      onClick={handleAddChannel}
      className={styles["new-channel-container"]}
    >
      <AvatarFallback className={styles["new-channel-container__fallback"]}>
        +
      </AvatarFallback>
    </Avatar>
  );
};
