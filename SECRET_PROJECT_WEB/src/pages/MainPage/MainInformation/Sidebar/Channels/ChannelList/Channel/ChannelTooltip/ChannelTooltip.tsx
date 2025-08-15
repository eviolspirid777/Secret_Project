import { Tooltip, TooltipTrigger, TooltipContent } from "@/shadcn/ui/tooltip";

import styles from "./ChannelTooltip.module.scss";
import type { ChannelDto } from "@/types/Channel/Channel";
import type { FC } from "react";
import { useState } from "react";

type ChannelTooltipProps = {
  channel: ChannelDto;
  children: React.ReactNode;
};

export const ChannelTooltip: FC<ChannelTooltipProps> = ({
  channel,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Tooltip delayDuration={500} open={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger className={styles["channel-container"]}>
        {children}
      </TooltipTrigger>
      <TooltipContent
        className={styles["channel-container__hover-card"]}
        side="right"
      >
        <h2>{channel.name}</h2>
      </TooltipContent>
    </Tooltip>
  );
};
