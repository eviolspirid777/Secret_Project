import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuShortcut,
} from "@/shadcn/ui/context-menu";
import type { ChannelDto } from "@/types/Channel/Channel";
import { useState, type FC } from "react";
import { NewUserDialog } from "./NewUserDialog/NewUserDialog";
import { toast } from "sonner";

import styles from "./styles.module.scss";

type ChannelContextMenuProps = {
  channel: ChannelDto;
  children: React.ReactNode;
};

export const ChannelContextMenu: FC<ChannelContextMenuProps> = ({
  channel,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const handleCopyChannelId = () => {
    navigator.clipboard.writeText(channel.id).then(() => {
      toast.success("ID канала скопирован в буфер обмена");
    });
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className={styles["channel-context-menu"]}>
          <ContextMenuItem inset>
            Пометить как прочитанное
            <ContextMenuShortcut>alt+c</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem inset onClick={setOpen.bind(null, true)}>
            Пригласить в канал
          </ContextMenuItem>
          <ContextMenuItem inset onClick={handleCopyChannelId}>
            Скопировать id канала
          </ContextMenuItem>
          {/* <ContextMenuCheckboxItem
          checked={!channel.isMuted}
          onCheckedChange={console.log.bind(null, "checked")}
        >
          {channel.isMuted ? "Включить оповещения" : "Выключить оповещения"}
        </ContextMenuCheckboxItem> */}
          <ContextMenuItem inset className="context-menu-item__delete">
            Покинуть канал
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <NewUserDialog open={open} setOpen={setOpen} />
    </>
  );
};
