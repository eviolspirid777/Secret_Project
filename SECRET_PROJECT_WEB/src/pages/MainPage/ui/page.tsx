import { ChannelList } from "../Channels/ChannelList/ChannelList";
import { Outlet } from "react-router";
import { ShortProfile } from "../Profile/ShortProfile/ShortProfile";
import { Friends } from "../Friends/ui/Friends";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { setUser, setUserStatus } from "@/store/slices/User.slice";
import { useEffect } from "react";
import { ErrorPage } from "@/pages/ErrorPage/ui";
import { useUserInformation } from "@/shared/hooks/user/useUserInformation";
import { Loader } from "@/shared/components/Loader/loader";
import { useDispatch } from "react-redux";

import styles from "./styles.module.scss";
import { useChangeUserStatus } from "@/shared/hooks/user/useChangeUserStatus";
import { useMessageDisplay } from "@/shared/hooks/messageAlert/useMessageDisplay";

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

  useMessageDisplay();

  useEffect(() => {
    if (userInformation) {
      dispatch(setUser(userInformation));
    }
  }, [userInformation]);

  useEffect(() => {
    const sendOfflineStatus = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      const confirm = window.confirm("Вы уверены?");

      if (confirm) {
        changeUserStatus({
          status: "Offline",
          userId: localStorageService.getUserId() ?? "",
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        changeUserStatus({
          userId: localStorageService.getUserId() ?? "",
          status: "Sleeping",
        });
        dispatch(setUserStatus({ status: "Sleeping" }));
      } else if (document.visibilityState === "visible") {
        changeUserStatus({
          userId: localStorageService.getUserId() ?? "",
          status: "Online",
        });
        dispatch(setUserStatus({ status: "Online" }));
      }
    };

    const handleBlur = () => {
      changeUserStatus({
        userId: localStorageService.getUserId() ?? "",
        status: "Sleeping",
      });
      dispatch(setUserStatus({ status: "Sleeping" }));
    };

    const handleFocus = () => {
      changeUserStatus({
        userId: localStorageService.getUserId() ?? "",
        status: "Online",
      });
      dispatch(setUserStatus({ status: "Online" }));
    };

    //TODO: разобраться с событиями
    // window.addEventListener("beforeunload", sendOfflineStatus);
    // window.addEventListener("unload", sendOfflineStatus);
    window.addEventListener("pagehide", sendOfflineStatus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      // window.removeEventListener("beforeunload", sendOfflineStatus);
      // window.removeEventListener("unload", sendOfflineStatus);
      window.removeEventListener("pagehide", sendOfflineStatus);
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
