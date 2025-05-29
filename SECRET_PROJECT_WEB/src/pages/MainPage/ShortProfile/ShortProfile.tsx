import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { TbHeadphones, TbHeadphonesOff } from "react-icons/tb";
import { changeMicrophoneState } from "@/store/slices/User.slice";
import { changeHeadphonesState } from "@/store/slices/User.slice";

import styles from "./ShortProfile.module.scss";

export const ShortProfile = () => {
  const userName = useSelector((state: RootState) => state.user.userInfo.name);
  const userAvatar = useSelector(
    (state: RootState) => state.user.userInfo.avatar
  );
  const isMicrophoneMuted = useSelector(
    (state: RootState) => state.user.userInfo.states.isMicrophoneMuted
  );
  const isHeadphonesMuted = useSelector(
    (state: RootState) => state.user.userInfo.states.isHeadphonesMuted
  );

  const dispatch = useDispatch();

  return (
    <div className={styles["short-profile-container"]}>
      <div className={styles["short-profile-container__info"]}>
        <img src={userAvatar} alt="avatar" />
        <span>{userName}</span>
      </div>
      <div className={styles["short-profile-container__controls"]}>
        {isMicrophoneMuted ? (
          <FaMicrophoneSlash
            onClick={dispatch.bind(null, changeMicrophoneState())}
          />
        ) : (
          <FaMicrophone
            onClick={dispatch.bind(null, changeMicrophoneState())}
          />
        )}
        {isHeadphonesMuted ? (
          <TbHeadphonesOff
            onClick={dispatch.bind(null, changeHeadphonesState())}
          />
        ) : (
          <TbHeadphones
            onClick={dispatch.bind(null, changeHeadphonesState())}
          />
        )}
      </div>
    </div>
  );
};
