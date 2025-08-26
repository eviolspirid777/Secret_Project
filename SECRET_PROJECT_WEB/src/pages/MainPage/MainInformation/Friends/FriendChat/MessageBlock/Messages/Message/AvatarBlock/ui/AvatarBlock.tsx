import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";

import styles from "./styles.module.scss";
import type { FC } from "react";

type AvatarBlockProps = {
  avatar?: string;
  senderName?: string;
};

export const AvatarBlock: FC<AvatarBlockProps> = ({ avatar, senderName }) => {
  return (
    <Avatar className={styles["avatar"]}>
      <AvatarImage src={avatar} />
      <AvatarFallback>
        {senderName
          ?.split(" ")
          .map((name, index) => {
            if ([0, 1].includes(index)) return name[0];
          })
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};
