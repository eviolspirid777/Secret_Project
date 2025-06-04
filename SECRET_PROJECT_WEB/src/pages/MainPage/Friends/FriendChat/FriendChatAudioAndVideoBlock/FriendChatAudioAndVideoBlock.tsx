import { Button } from "@/shadcn/ui/button";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
import { getUserAudioStates } from "@/store/slices/User.slice";
import { useSelector } from "react-redux";
import { useAudioStates } from "@/shared/hooks/audioStates/useAudioStates";
import type { FC } from "react";
import { useState } from "react";

import styles from "./styles.module.scss";

type FriendChatAudioAndVideoBlockProps = {
  handleDisconnect: () => void;
};

export const FriendChatAudioAndVideoBlock: FC<
  FriendChatAudioAndVideoBlockProps
> = ({ handleDisconnect }) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const audioStates = useSelector(getUserAudioStates);

  const { changeMicrophoneStateHandler } = useAudioStates();

  return (
    <div className={styles["friend-chat-audio-and-video-block"]}>
      <div
        className={styles["friend-chat-audio-and-video-block__audio-or-video"]}
      ></div>
      <div className={styles["friend-chat-audio-and-video-block__actions"]}>
        <Button
          className={
            styles["friend-chat-audio-and-video-block__actions-button"]
          }
          onClick={setIsVideoEnabled.bind(null, (prev) => !prev)}
        >
          {isVideoEnabled ? (
            <FaVideoSlash
              className={
                styles[
                  "friend-chat-audio-and-video-block__actions-icon__danger"
                ]
              }
              size={25}
            />
          ) : (
            <FaVideo
              className={
                styles["friend-chat-audio-and-video-block__actions-icon"]
              }
            />
          )}
        </Button>
        <Button
          className={
            styles["friend-chat-audio-and-video-block__actions-button"]
          }
          onClick={changeMicrophoneStateHandler}
        >
          {audioStates.isMicrophoneMuted ? (
            <FaMicrophoneSlash
              className={
                styles[
                  "friend-chat-audio-and-video-block__actions-icon__danger"
                ]
              }
              size={25}
            />
          ) : (
            <FaMicrophone
              className={
                styles["friend-chat-audio-and-video-block__actions-icon"]
              }
              size={20}
            />
          )}
        </Button>
        <Button
          className={
            styles["friend-chat-audio-and-video-block__actions-button"]
          }
          onClick={handleDisconnect}
        >
          <FaPhoneSlash
            className={
              styles["friend-chat-audio-and-video-block__actions-icon__danger"]
            }
            size={25}
          />
        </Button>
      </div>
    </div>
  );
};
