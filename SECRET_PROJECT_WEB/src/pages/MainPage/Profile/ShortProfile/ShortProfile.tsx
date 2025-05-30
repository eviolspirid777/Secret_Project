import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { TbHeadphones, TbHeadphonesOff } from "react-icons/tb";
import {
  changeMicrophoneState,
  changeHeadphonesState,
} from "@/store/slices/User.slice";

import styles from "./styles.module.scss";

export const ShortProfile = () => {
  const userName = useSelector((state: RootState) => state.user.name);
  const userAvatar = useSelector((state: RootState) => state.user.avatar);
  const isMicrophoneMuted = useSelector(
    (state: RootState) => state.user.states.isMicrophoneMuted
  );
  const isHeadphonesMuted = useSelector(
    (state: RootState) => state.user.states.isHeadphonesMuted
  );

  const dispatch = useDispatch();

  return (
    <div className={styles["short-profile-container"]}>
      <div className={styles["short-profile-container__info"]}>
        <img src={userAvatar} alt="avatar" />
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
          </div>
        </div>
      </div>
    </div>
  );
};
