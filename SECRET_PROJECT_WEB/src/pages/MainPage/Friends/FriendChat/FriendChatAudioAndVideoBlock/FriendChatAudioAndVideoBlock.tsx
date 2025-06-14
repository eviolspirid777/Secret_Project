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
import { memo, useState } from "react";
import { useWebRTC } from "@/shared/hooks/webRTC/useWebRTC";
import { Participant } from "@/shared/components/Participant/Participant";

import styles from "./styles.module.scss";
import { useGetRoomUsers } from "@/shared/hooks/message/room/useGetRoomUsers";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";

type FriendChatAudioAndVideoBlockProps = {
  handleDisconnect: () => void;
  roomId: string | null;
  isConnectedToCall: boolean;
};

export const FriendChatAudioAndVideoBlock: FC<FriendChatAudioAndVideoBlockProps> =
  memo(({ handleDisconnect, roomId, isConnectedToCall }) => {
    const { socketRef } = useWebRTC(roomId, isConnectedToCall);

    const [isVideoEnabled, setIsVideoEnabled] = useState(false);
    const audioStates = useSelector(getUserAudioStates);

    const { changeMicrophoneStateHandler } = useAudioStates();

    const handleDropCall = async () => {
      if (roomId) {
        socketRef.current.emit(
          "disconnect-from-room",
          roomId,
          localStorageService.getUserId()
        );
        handleDisconnect();
      }
    };

    const { roomUsers } = useGetRoomUsers(roomId);

    return (
      <div className={styles["friend-chat-audio-and-video-block"]}>
        <div
          className={
            styles["friend-chat-audio-and-video-block__audio-or-video"]
          }
        >
          <div
            className={
              styles[
                "friend-chat-audio-and-video-block__audio-or-video__caller-block"
              ]
            }
          >
            {roomUsers &&
              roomUsers.map((user) => (
                <Participant key={user.userId} user={user} />
              ))}
          </div>
        </div>
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
            onClick={handleDropCall}
          >
            <FaPhoneSlash
              className={
                styles[
                  "friend-chat-audio-and-video-block__actions-icon__danger"
                ]
              }
              size={25}
            />
          </Button>
        </div>
      </div>
    );
  });
