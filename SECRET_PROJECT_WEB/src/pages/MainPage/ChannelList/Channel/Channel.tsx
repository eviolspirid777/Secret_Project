import type { Channel as ChannelType } from "@/types/Channel/Channel";
import type { FC } from "react";

import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { ChannelTooltip } from "./ChannelTooltip/ChannelTooltip";
import { ChannelContextMenu } from "./ChannelContextMenu/ChannelContextMenu";

type ChannelProps = {
  channel: ChannelType;
};

export const Channel: FC<ChannelProps> = ({ channel }) => {
  return (
    <TooltipProvider>
      <ChannelContextMenu channel={channel}>
        <ChannelTooltip channel={channel}>
          <img src={channel.image} />
        </ChannelTooltip>
      </ChannelContextMenu>
    </TooltipProvider>
  );
};
