import { ChannelList } from "../Channels/ChannelList/ChannelList";
import { Outlet } from "react-router";
import { ShortProfile } from "../Profile/ShortProfile/ShortProfile";
import { Friends } from "../Friends/ui/Friends";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { setUser } from "@/store/slices/User.slice";
import { useEffect } from "react";
import { ErrorPage } from "@/pages/ErrorPage/ui";
import { useUserInformation } from "@/shared/hooks/user/useUserInformation";
import { Loader } from "@/shared/components/Loader/loader";
import { useDispatch } from "react-redux";
import { useMessageDisplay } from "@/shared/hooks/messageAlert/useMessageDisplay";
import { useChangeUserActivityState } from "@/shared/hooks/activityStates/useChangeUserActivityState";

import styles from "./styles.module.scss";
import { useGetUserChannels } from "@/shared/hooks/channel/user/useGetUserChannels";
import { setChannels } from "@/store/slices/Channels.slice";

export const Page = () => {
  /*TODO:
    Вот тут должна быть проверка на текущего пользователя. Чтобы подставлялись его данные.(можно хранить в localStorage id пользователя)
    Если пользователь не авторизован, то перенаправлять на страницу авторизации.
    Если авторизован, то запрашивать данные пользователя и подставлять их в компоненты.
  */
  const dispatch = useDispatch();

  const { userInformation, isLoadingUserInformation, errorUserInformation } =
    useUserInformation(localStorageService.getUserId() ?? "");

  useEffect(() => {
    if (userInformation) {
      dispatch(setUser(userInformation));
    }
  }, [userInformation]);

  const { userChannels } = useGetUserChannels(
    localStorageService.getUserId() ?? ""
  );

  useEffect(() => {
    if (userChannels) {
      dispatch(setChannels(userChannels));
    }
  }, [userChannels]);

  useMessageDisplay();

  useChangeUserActivityState();

  if (isLoadingUserInformation) return <Loader />;
  if (errorUserInformation) return <ErrorPage />;

  return (
    <div className={styles["main-page-container"]}>
      <h1>Secret Project</h1>
      <div className={styles["main-page-container-content"]}>
        {/*TODO: Добавить возможность dnd для серверов*/}
        <div className={styles["main-page-container-content__side-bar"]}>
          <ChannelList />
          <ShortProfile />
        </div>
        <Friends />
        <div className={styles["main-page-container-content__main"]}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
