import { ChannelList } from "./ChannelList/ChannelList";
import { OutletDisplay } from "./OutletDisplay/OutletDisplay";

import styles from "./styles.module.scss";
import { ShortProfile } from "./ShortProfile/ShortProfile";

export const Page = () => {
  return (
    <div className={styles["main-page-container"]}>
      <h1>Secret Project</h1>
      <div className={styles["main-page-container-content"]}>
        {/*TODO: Можно переписать под еще один вложенный роутер, который будет отображать данные в Outlet */}
        {/*TODO: Добавить возможность dnd для серверов*/}
        <div className={styles["main-page-container-content__side-bar"]}>
          <ChannelList />
          <ShortProfile />
        </div>
        <OutletDisplay />
      </div>
    </div>
  );
};
