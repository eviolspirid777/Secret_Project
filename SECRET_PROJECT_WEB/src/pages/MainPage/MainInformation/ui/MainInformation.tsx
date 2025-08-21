import { useEffect, type FC } from "react";
import { Friends } from "../Friends/ui/Friends";
import { useChangeUserActivityState } from "@/shared/hooks/activityStates/useChangeUserActivityState";
import { useGetUserChannels } from "@/shared/hooks/channel/user/useGetUserChannels";
import { useMessageDisplay } from "@/shared/hooks/messageAlert/useMessageDisplay";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { setChannels } from "@/store/slices/Channels.slice";
import { setUser } from "@/store/slices/User.slice";
import type { User } from "@/types/User/User";
import { useDispatch } from "react-redux";
import { Sidebar } from "../Sidebar/ui/Sidebar";

import styles from "./styles.module.scss";
import { Display } from "../Display/ui/Display";

type MainInformationProps = {
  userInformation?: User;
};

export const MainInformation: FC<MainInformationProps> = ({
  userInformation,
}) => {
  const dispatch = useDispatch();

  useMessageDisplay();
  useChangeUserActivityState();

  const { userChannels } = useGetUserChannels(
    localStorageService.getUserId() ?? ""
  );

  useEffect(() => {
    if (userInformation) {
      dispatch(setUser(userInformation));
    }
  }, [userInformation, dispatch]);

  useEffect(() => {
    if (userChannels) {
      dispatch(setChannels(userChannels));
    }
  }, [userChannels, dispatch]);

  return (
    <div className={styles["main-page-container"]}>
      <h1>Secret Project</h1>
      <div className={styles["main-page-container-content"]}>
        {/*TODO: Добавить возможность dnd для серверов*/}
        <Sidebar />
        <Friends />
        <Display />
      </div>
    </div>
  );
};
