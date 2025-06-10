import { Avatar, AvatarFallback } from "@/shadcn/ui/avatar";
import { memo, type FC, type MouseEventHandler } from "react";

import styles from "./styles.module.scss";

type NewChannelProps = {
  onClick?: MouseEventHandler<HTMLSpanElement>;
};

export const NewChannel: FC<NewChannelProps> = memo(({ onClick }) => {
  return (
    <Avatar onClick={onClick} className={styles["new-channel-container"]}>
      <AvatarFallback className={styles["new-channel-container__fallback"]}>
        +
      </AvatarFallback>
    </Avatar>
  );
});
