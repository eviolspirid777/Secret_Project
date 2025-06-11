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
import { useEffect, useRef, useState } from "react";

import styles from "./styles.module.scss";
import { useWebRTC } from "@/shared/services/SocketIO/useWebRTC";
import { messageSignalRServiceInstance } from "@/shared/services/SignalR/Messages/MessageSignalRService";

type FriendChatAudioAndVideoBlockProps = {
  handleDisconnect: () => void;
};

export const FriendChatAudioAndVideoBlock: FC<
  FriendChatAudioAndVideoBlockProps
> = ({ handleDisconnect }) => {
  const roomId = "1111";
  const { stream, remoteStreams } = useWebRTC(roomId);

  const videoRef = useRef<HTMLVideoElement>(null);

  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  useEffect(() => {
    remoteStreams.forEach((remoteStream, idx) => {
      if (audioRefs.current[idx]) {
        audioRefs.current[idx]!.srcObject = remoteStream;
      }
    });
  }, [remoteStreams]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const audioStates = useSelector(getUserAudioStates);

  const { changeMicrophoneStateHandler } = useAudioStates();

  useEffect(() => {
    messageSignalRServiceInstance.onReceiveRoomCreated((room) => {
      console.log("room", room);
    });

    messageSignalRServiceInstance.onReceiveRoomDeleted((roomId) => {
      console.log("roomId", roomId);
    });

    return () => {
      messageSignalRServiceInstance.stopOnReceiveRoomCreated();
      messageSignalRServiceInstance.stopOnReceiveRoomDeleted();
    };
  }, []);

  return (
    <div className={styles["friend-chat-audio-and-video-block"]}>
      <div
        className={styles["friend-chat-audio-and-video-block__audio-or-video"]}
      >
        <video ref={videoRef} autoPlay playsInline />
        {/* Для каждого входящего аудиопотока создаём отдельный <audio> */}
        {remoteStreams.map((remoteStream, idx) => (
          <audio
            key={idx}
            ref={(el) => {
              if (el) {
                audioRefs.current[idx] = el;
              }
            }}
            autoPlay
            playsInline
          />
        ))}
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
