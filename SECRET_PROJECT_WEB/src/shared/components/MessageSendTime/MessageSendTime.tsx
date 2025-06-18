import { formatTime } from "@/shared/helpers/timeFormater/timeFormater";
import type { FC } from "react";

import styles from "./styles.module.scss";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shadcn/ui/tooltip";
import dayjs from "dayjs";

type MessageSendTimeProps = {
  sentAt: string;
};

export const MessageSendTime: FC<MessageSendTimeProps> = ({ sentAt }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <span className={styles["message__time"]}>{formatTime(sentAt)}</span>;
      </TooltipTrigger>
      <TooltipContent className={styles["message__time__tooltip-content"]}>
        <label>{dayjs(sentAt).format("D MMMM, YYYY HH:mm:ss")}</label>
      </TooltipContent>
    </Tooltip>
  );
};
