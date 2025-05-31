import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { TbHeadphones, TbHeadphonesOff } from "react-icons/tb";
import {
  changeMicrophoneState,
  changeHeadphonesState,
} from "@/store/slices/User.slice";
import { Badge } from "@/shared/components/Badge/Badge";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router";

import styles from "./styles.module.scss";

export const ShortProfile = () => {
  const navigate = useNavigate();

  const userName = useSelector((state: RootState) => state.user.name);
  const userAvatar = useSelector((state: RootState) => state.user.avatar);
  const userStatus = useSelector((state: RootState) => state.user.status);
  const isMicrophoneMuted = useSelector(
    (state: RootState) => state.user.states.isMicrophoneMuted
  );
  const isHeadphonesMuted = useSelector(
    (state: RootState) => state.user.states.isHeadphonesMuted
  );

  const dispatch = useDispatch();

  const navigateToSettings = () => {
    navigate("/settings");
  };

  return (
    <div className={styles["short-profile-container"]}>
      <div className={styles["short-profile-container__info"]}>
        <div className={styles["short-profile-container__info-avatar-wrapper"]}>
          <img src={userAvatar} alt="avatar" />
          <Badge
            className={
              styles["short-profile-container__info-avatar-wrapper__badge"]
            }
            variant={userStatus}
          />
        </div>
        <div>
          <span>{userName}</span>
          <div className={styles["short-profile-container__controls"]}>
            {isMicrophoneMuted ? (
              <FaMicrophoneSlash
                className={
                  styles["short-profile-container__controls-icon__danger"]
                }
                size={25}
                onClick={dispatch.bind(null, changeMicrophoneState())}
              />
            ) : (
              <FaMicrophone
                className={styles["short-profile-container__controls-icon"]}
                size={20}
                onClick={dispatch.bind(null, changeMicrophoneState())}
              />
            )}
            {isHeadphonesMuted ? (
              <TbHeadphonesOff
                className={
                  styles["short-profile-container__controls-icon__danger"]
                }
                size={25}
                onClick={dispatch.bind(null, changeHeadphonesState())}
              />
            ) : (
              <TbHeadphones
                size={25}
                onClick={dispatch.bind(null, changeHeadphonesState())}
              />
            )}
            <IoSettingsSharp size={23} onClick={navigateToSettings} />
          </div>
        </div>
      </div>
    </div>
  );
};
