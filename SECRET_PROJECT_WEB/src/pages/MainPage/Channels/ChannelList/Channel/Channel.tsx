import type { Channel as ChannelType } from "@/types/Channel/Channel";
import type { FC } from "react";
import { useNavigate } from "react-router";

import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { ChannelTooltip } from "./ChannelTooltip/ChannelTooltip";
import { ChannelContextMenu } from "./ChannelContextMenu/ChannelContextMenu";

import styles from "./styles.module.scss";

type ChannelProps = {
  channel: ChannelType;
};

export const Channel: FC<ChannelProps> = ({ channel }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/channels/${channel.id}`);
  };

  return (
    <TooltipProvider>
      <ChannelContextMenu channel={channel}>
        <ChannelTooltip channel={channel}>
          <div className={styles["channel"]} onClick={handleClick}>
            <img src={channel.image} alt={channel.name} />
          </div>
        </ChannelTooltip>
      </ChannelContextMenu>
    </TooltipProvider>
  );
};
