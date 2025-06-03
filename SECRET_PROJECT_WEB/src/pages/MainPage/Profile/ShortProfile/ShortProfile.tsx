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
import { Avatar } from "@/shared/components/Avatar/Avatar";
import { useChangeMicrophoneState } from "@/shared/hooks/user/soundState/useChangeMicrophoneState";
import { useChangeHeadphonesState } from "@/shared/hooks/user/soundState/useChangeHeadphonesState";
import { toast } from "sonner";
import { TooltipContent, TooltipTrigger } from "@/shadcn/ui/tooltip";
import { Tooltip } from "@/shadcn/ui/tooltip";

export const ShortProfile = () => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  const { changeMicrophoneStateAsync } = useChangeMicrophoneState();
  const { changeHeadphonesStateAsync } = useChangeHeadphonesState();

  const changeMicrophoneStateHandler = async () => {
    try {
      const response = await changeMicrophoneStateAsync(user.userId);
      if (response.status === 200) {
        dispatch(changeMicrophoneState(response.data));
      }
    } catch (error) {
      toast.error(`Ошибка при выключении микрофона! ${error}`);
    }
  };

  const changeHeadphonesStateHandler = async () => {
    try {
      const response = await changeHeadphonesStateAsync(user.userId);
      if (response.status === 200) {
        dispatch(changeHeadphonesState(response.data));
      }
    } catch (error) {
      toast.error(`Ошибка при выключении наушников! ${error}`);
    }
  };

  const navigate = useNavigate();

  const navigateToSettings = () => {
    navigate("/settings");
  };

  const handleCopyUserId = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();

    navigator.clipboard
      .writeText(user.userId)
      .then(() => {
        toast.success("ID пользователя скопирован в буфер обмена");
      })
      .catch(() => {
        toast.error("Ошибка при копировании ID пользователя");
      });
  };

  return (
    <div className={styles["short-profile-container"]}>
      <div className={styles["short-profile-container__info"]}>
        <div className={styles["short-profile-container__info-avatar-wrapper"]}>
          <Avatar
            src={user.avatar}
            size="medium"
            className={
              styles["short-profile-container__info-avatar-wrapper__avatar"]
            }
          />
          <Badge
            className={
              styles["short-profile-container__info-avatar-wrapper__badge"]
            }
            variant={user.status}
          />
        </div>
        <div>
          <Tooltip delayDuration={300}>
            <TooltipTrigger>
              <span
                className={styles["short-profile-container__info-name"]}
                onClick={handleCopyUserId}
              >
                {user.name}
              </span>
            </TooltipTrigger>
            <TooltipContent
              className={styles["short-profile-container__info-name-tooltip"]}
            >
              Скопировать id пользователя
            </TooltipContent>
          </Tooltip>
          <div className={styles["short-profile-container__controls"]}>
            {user.states.isMicrophoneMuted ? (
              <FaMicrophoneSlash
                className={
                  styles["short-profile-container__controls-icon__danger"]
                }
                size={25}
                onClick={changeMicrophoneStateHandler}
              />
            ) : (
              <FaMicrophone
                className={styles["short-profile-container__controls-icon"]}
                size={20}
                onClick={changeMicrophoneStateHandler}
              />
            )}
            {user.states.isHeadphonesMuted ? (
              <TbHeadphonesOff
                className={
                  styles["short-profile-container__controls-icon__danger"]
                }
                size={25}
                onClick={changeHeadphonesStateHandler}
              />
            ) : (
              <TbHeadphones size={25} onClick={changeHeadphonesStateHandler} />
            )}
            <IoSettingsSharp size={23} onClick={navigateToSettings} />
          </div>
        </div>
      </div>
    </div>
  );
};
