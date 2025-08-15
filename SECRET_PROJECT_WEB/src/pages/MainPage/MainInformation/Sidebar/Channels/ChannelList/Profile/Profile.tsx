import { useNavigate } from "react-router";

import styles from "./styles.module.scss";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shadcn/ui/context-menu";
import { IoSettingsSharp } from "react-icons/io5";
import { Avatar } from "@/shared/components/Avatar/Avatar";
import { useSelector } from "react-redux";
import { getUserAvatar } from "@/store/slices/User.slice";
import { memo } from "react";

export const Profile = memo(() => {
  const navigate = useNavigate();
  const userAvatar = useSelector(getUserAvatar);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={styles["profile-container"]}
          onClick={() => navigate("/my-profile")}
        >
          <Avatar
            src={userAvatar}
            size="medium"
            className={styles["profile-container__avatar"]}
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className={styles["channel-context-menu"]}>
        <ContextMenuItem>
          <IoSettingsSharp />
          Настройки
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});
