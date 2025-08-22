import type { ChannelDto } from "@/types/Channel/Channel";
import type { FC } from "react";
import { useNavigate } from "react-router";

import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { ChannelTooltip } from "../ChannelTooltip/ui/ChannelTooltip";
import { ChannelContextMenu } from "../ChannelContextMenu/ui/ChannelContextMenu";

import styles from "./styles.module.scss";
import { Avatar, AvatarImage, AvatarFallback } from "@/shadcn/ui/avatar";

type ChannelProps = {
  channel: ChannelDto;
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
          <Avatar className={styles["channel__avatar"]} onClick={handleClick}>
            <AvatarImage src={channel.channelAvatarUrl} />
            <AvatarFallback>
              {channel.name
                .split(" ")
                .map((name, index) => {
                  if ([0, 1].includes(index)) return name[0];
                })
                .join("")}
            </AvatarFallback>
          </Avatar>
        </ChannelTooltip>
      </ChannelContextMenu>
    </TooltipProvider>
  );
};
