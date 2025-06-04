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

import styles from "./styles.module.scss";
import { useChangeUserStatus } from "@/shared/hooks/user/useChangeUserStatus";

export const Page = () => {
  /*TODO:
    Вот тут должна быть проверка на текущего пользователя. Чтобы подставлялись его данные.(можно хранить в localStorage id пользователя)
    Если пользователь не авторизован, то перенаправлять на страницу авторизации.
    Если авторизован, то запрашивать данные пользователя и подставлять их в компоненты.
  */
  const dispatch = useDispatch();
  const { changeUserStatus } = useChangeUserStatus();

  const { userInformation, isLoadingUserInformation, errorUserInformation } =
    useUserInformation(localStorageService.getUserId() ?? "");

  useEffect(() => {
    if (userInformation) {
      dispatch(setUser(userInformation));
    }
  }, [userInformation]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      changeUserStatus({
        userId: localStorageService.getUserId() ?? "",
        status: "Offline",
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        changeUserStatus({
          userId: localStorageService.getUserId() ?? "",
          status: "Sleeping",
        });
      } else if (document.visibilityState === "visible") {
        changeUserStatus({
          userId: localStorageService.getUserId() ?? "",
          status: "Online",
        });
      }
    };

    const handleBlur = () => {
      changeUserStatus({
        userId: localStorageService.getUserId() ?? "",
        status: "Sleeping",
      });
    };

    const handleFocus = () => {
      changeUserStatus({
        userId: localStorageService.getUserId() ?? "",
        status: "Online",
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [changeUserStatus]);

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
