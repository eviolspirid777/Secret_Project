import { changeHeadphonesState, getUser } from "@/store/slices/User.slice";

import { toast } from "sonner";
import { useChangeMicrophoneState } from "../user/soundState/useChangeMicrophoneState";
import { useChangeHeadphonesState } from "../user/soundState/useChangeHeadphonesState";
import { changeMicrophoneState } from "@/store/slices/User.slice";
import { useDispatch, useSelector } from "react-redux";

export const useAudioStates = () => {
  const user = useSelector(getUser);

  const { changeMicrophoneStateAsync } = useChangeMicrophoneState();
  const { changeHeadphonesStateAsync } = useChangeHeadphonesState();

  const dispatch = useDispatch();

  const changeMicrophoneStateHandler = async () => {
    try {
      console.log(user.userId);
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

  return {
    changeMicrophoneStateHandler,
    changeHeadphonesStateHandler,
  };
};
