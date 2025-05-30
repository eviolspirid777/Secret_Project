import { ChannelList } from "../Channels/ChannelList/ChannelList";
import { Outlet } from "react-router";
import { ShortProfile } from "../Profile/ShortProfile/ShortProfile";

import styles from "./styles.module.scss";

export const Page = () => {
  /*TODO:
  Вот тут должна быть проверка на текущего пользователя. Чтобы подставлялись его данные.(можно хранить в localStorage id пользователя)
  Если пользователь не авторизован, то перенаправлять на страницу авторизации.
  Если авторизован, то запрашивать данные пользователя и подставлять их в компоненты.
  */
  return (
    <div className={styles["main-page-container"]}>
      <h1>Secret Project</h1>
      <div className={styles["main-page-container-content"]}>
        {/*TODO: Добавить возможность dnd для серверов*/}
        <div className={styles["main-page-container-content__side-bar"]}>
          <ChannelList />
          <ShortProfile />
        </div>
        <div className={styles["main-page-container-content__main"]}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
