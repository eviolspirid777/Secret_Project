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
import { memo, useEffect, useRef, useState } from "react";
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
    const { socketRef, streamTrack } = useWebRTC(roomId, isConnectedToCall);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
      console.log("STREAM_TRACK_EFFECT");
      if (streamTrack && audioRef.current) {
        console.log("STREAM_TRACK_IS_CONNECTING");
        console.log(streamTrack);
        const stream = new MediaStream([streamTrack]);
        audioRef.current.srcObject = stream;
        audioRef.current.play();
        console.log(audioRef.current.paused);
        console.log("STREAM_TRACK_IS_CONNECTED");
      }
    }, [streamTrack]);

    const [isVideoEnabled, setIsVideoEnabled] = useState(false);
    const audioStates = useSelector(getUserAudioStates);

    const { changeMicrophoneStateHandler } = useAudioStates();

    const handleDropCall = async () => {
      if (roomId) {
        socketRef.current?.emit(
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
          <audio ref={audioRef} autoPlay controls />
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
            onMouseEnter={() => audioRef.current?.play()}
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
