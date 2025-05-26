import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuShortcut,
} from "@/shadcn/ui/context-menu";
import type { Channel } from "@/types/Channel/Channel";
import type { FC } from "react";

import styles from "./styles.module.scss";

type ChannelContextMenuProps = {
  channel: Channel;
  children: React.ReactNode;
};

export const ChannelContextMenu: FC<ChannelContextMenuProps> = ({
  channel,
  children,
}) => (
  <ContextMenu>
    <ContextMenuTrigger>{children}</ContextMenuTrigger>
    <ContextMenuContent className={styles["channel-context-menu"]}>
      <ContextMenuItem inset>
        Пометить как прочитанное
        <ContextMenuShortcut>alt+c</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem inset>Пригласить в канал</ContextMenuItem>
      <ContextMenuCheckboxItem
        checked={!channel.isMuted}
        onCheckedChange={console.log.bind(null, "checked")}
      >
        {channel.isMuted ? "Включить оповещения" : "Выключить оповещения"}
      </ContextMenuCheckboxItem>
      <ContextMenuItem
        inset
        className={styles["channel-context-menu__delete-item"]}
      >
        Покинуть канал
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
);
