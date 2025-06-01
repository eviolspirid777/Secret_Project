import { useSelector, useDispatch } from "react-redux";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { TbHeadphones, TbHeadphonesOff } from "react-icons/tb";
import {
  changeMicrophoneState,
  changeHeadphonesState,
  getUser,
} from "@/store/slices/User.slice";
import { Badge } from "@/shared/components/Badge/Badge";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router";

import styles from "./styles.module.scss";

export const ShortProfile = () => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const navigateToSettings = () => {
    navigate("/settings");
  };

  return (
    <div className={styles["short-profile-container"]}>
      <div className={styles["short-profile-container__info"]}>
        <div className={styles["short-profile-container__info-avatar-wrapper"]}>
          <img src={user.avatar} alt="avatar" />
          <Badge
            className={
              styles["short-profile-container__info-avatar-wrapper__badge"]
            }
            variant={user.status}
          />
        </div>
        <div>
          <span>{user.name}</span>
          <div className={styles["short-profile-container__controls"]}>
            {user.states.isMicrophoneMuted ? (
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
            {user.states.isHeadphonesMuted ? (
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
