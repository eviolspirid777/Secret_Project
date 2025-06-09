import { useEffect } from "react";
import { useChangeUserStatus } from "../user/useChangeUserStatus";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useDispatch } from "react-redux";
import { setUserStatus } from "@/store/slices/User.slice";

export const useChangeUserActivityState = () => {
  const { changeUserStatus } = useChangeUserStatus();
  const dispatch = useDispatch();

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
};
