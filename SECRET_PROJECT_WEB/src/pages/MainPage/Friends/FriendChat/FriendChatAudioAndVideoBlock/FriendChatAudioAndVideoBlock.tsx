import { Button } from "@/shadcn/ui/button";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
import { TbScreenShare, TbScreenShareOff } from "react-icons/tb";
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
import type { User } from "@/types/User/User";

type FriendChatAudioAndVideoBlockProps = {
  handleDisconnect: () => void;
  roomId: string | null;
  isConnectedToCall: boolean;
};

export const FriendChatAudioAndVideoBlock: FC<FriendChatAudioAndVideoBlockProps> =
  memo(({ handleDisconnect, roomId, isConnectedToCall }) => {
    const { roomUsers } = useGetRoomUsers(roomId);

    const audioStates = useSelector(getUserAudioStates);
    const { changeMicrophoneStateHandler } = useAudioStates();

    const [isScreenShared, setIsScreenShared] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(false);

    const audioChatRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const screenSharedStreamRef = useRef<HTMLVideoElement>(null);
    const displayStreamRef = useRef<MediaStream>(null);

    const { socketRef, streamTrack } = useWebRTC(
      roomId,
      isConnectedToCall,
      isScreenShared,
      screenSharedStreamRef
    );

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

    const renderVideo = (user: User) => {
      if (user.userId === localStorageService.getUserId()) {
        return (
          <video ref={screenSharedStreamRef} className={styles["video-chat"]} />
        );
      }

      return null;
    };

    const handleDropCall = async () => {
      if (roomId) {
        socketRef.current?.emit(
          "disconnect-from-room",
          roomId,
          localStorageService.getUserId()
        );
        setIsScreenShared(false);
        if (audioChatRef.current) {
          audioChatRef.current.style.height = "50%";
        }
        handleDisconnect();
      }
    };

    const handeShareScreen = async () => {
      try {
        if (isScreenShared) {
          cancelStream();
        } else {
          const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
          displayStreamRef.current = displayStream;

          if (audioChatRef.current) {
            audioChatRef.current.style.height = "75%";
          }

          if (screenSharedStreamRef.current) {
            screenSharedStreamRef.current.style.display = "block";
            screenSharedStreamRef.current.srcObject = displayStream;
            screenSharedStreamRef.current.play();

            displayStream.getTracks().forEach((track) => {
              track.onended = () => {
                cancelStream();
              };
            });
          }
          setIsScreenShared(true);
        }
      } catch (ex) {
        console.error(ex);
      }
    };

    const cancelStream = () => {
      if (screenSharedStreamRef.current) {
        screenSharedStreamRef.current.style.display = "none";
        if (audioChatRef.current) {
          audioChatRef.current.style.height = "50%";
        }
        setIsScreenShared(false);
      }
    };

    return (
      <div
        ref={audioChatRef}
        className={styles["friend-chat-audio-and-video-block"]}
      >
        <div
          className={
            styles["friend-chat-audio-and-video-block__audio-or-video"]
          }
        >
          <audio ref={audioRef} autoPlay controls style={{ display: "none" }} />
          <div
            className={
              styles[
                "friend-chat-audio-and-video-block__audio-or-video__caller-block"
              ]
            }
          >
            {roomUsers &&
              roomUsers.map((user) => (
                <Participant
                  key={user.userId}
                  user={user}
                  render={renderVideo.bind(null, user)}
                />
              ))}
          </div>
        </div>
        <div className={styles["friend-chat-audio-and-video-block__actions"]}>
          <Button
            className={
              styles["friend-chat-audio-and-video-block__actions-button"]
            }
            onClick={handeShareScreen}
          >
            {isScreenShared ? (
              <TbScreenShareOff
                size={25}
                className={
                  styles[
                    "friend-chat-audio-and-video-block__actions-icon__screen-share-off"
                  ]
                }
              />
            ) : (
              <TbScreenShare
                size={25}
                className={
                  styles[
                    "friend-chat-audio-and-video-block__actions-icon__screen-share"
                  ]
                }
              />
            )}
          </Button>
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
