import { useSelector } from "react-redux";
import { ChannelList } from "./ChannelList/ChannelList";
import { OutletDisplay } from "./OutletDisplay/OutletDisplay";
import type { RootState } from "@/store/store";

import styles from "./styles.module.scss";

export const Page = () => {
  const channels = useSelector((state: RootState) => state.channels.channels);

  return (
    <div className={styles["main-page-container"]}>
      <h1>Secret Project</h1>
      <div className={styles["main-page-container-content"]}>
        {/*TODO: Можно переписать под еще один вложенный роутер, который будет отображать данные в Outlet */}
        {/*TODO: Добавить возможность dnd для серверов*/}
        <ChannelList channels={channels} />
        <OutletDisplay />
      </div>
    </div>
  );
};
