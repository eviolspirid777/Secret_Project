import { useNavigate } from "react-router";

import styles from "./styles.module.scss";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shadcn/ui/context-menu";
import { IoSettingsSharp } from "react-icons/io5";

export const Profile = () => {
  const navigate = useNavigate();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={styles["profile-container"]}
          onClick={() => navigate("/my-profile")}
        >
          <img
            src="https://avatars.mds.yandex.net/get-yapic/63032/8ATPndJL2v9vXFwpqtisTne88aw-1/orig"
            alt=""
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
};
